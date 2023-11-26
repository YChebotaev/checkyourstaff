import path from 'node:path'
import cron from 'node-cron'
import JSONDB from 'simple-json-db'
import { Telegraf, Markup, session, type Context, type NarrowedContext } from 'telegraf'
import { mkdirpSync } from 'mkdirp'
import { without } from 'lodash'
import { readTemplate, logger } from './lib'
import type { FreeFormFeedback, Session, SessionAnswer } from './types'
import { Update, Message } from 'telegraf/typings/core/types/typegram'

mkdirpSync(path.join(__dirname, 'data'))

const token = process.env['BOT_TOKEN']
const welcome1Template = readTemplate(
  path.join(__dirname, './templates/welcome1.hbs')
)
const welcome2Template = readTemplate(
  path.join(__dirname, './templates/welcome2.hbs')
)
const question1Template = readTemplate(
  path.join(__dirname, './templates/question1.hbs')
)
const question2Template = readTemplate(
  path.join(__dirname, './templates/question2.hbs')
)
const question3Template = readTemplate(
  path.join(__dirname, './templates/question3.hbs')
)
const thanksTemplate = readTemplate(
  path.join(__dirname, './templates/thanks.hbs')
)
const closeQuestionTemplate = readTemplate(
  path.join(__dirname, './templates/closeQuestion.hbs')
)
const communicationRequestTemplate = readTemplate(
  path.join(__dirname, './templates/communicationRequest.hbs')
)
const freeFormFeedbackTemplate = readTemplate(
  path.join(__dirname, './templates/freeFormFeedback.hbs')
)
const timezone = process.env['TZ'] ?? 'Europe/Moscow'
let db = new JSONDB(
  path.join(__dirname, 'data/db.json'),
  {
    syncOnWrite: true
  }
)
const demoStore: {
  sessions: Session[]
} = {
  sessions: []
}

if (!token) {
  throw new Error("Bot must have BOT_TOKEN env variable set")
}

const bot = new Telegraf(token)

setInterval(async () => {
  // REFRESH DB

  db = new JSONDB(
    path.join(__dirname, 'data/db.json'),
    {
      syncOnWrite: true
    }
  )

  // PROCESS PENDING MESSAGES

  const pendingMessages = db.get('pendingMessages') ?? []

  for (const pendingMessage of pendingMessages) {
    const { chatId, username, role } = pendingMessage

    await bot.telegram.sendMessage(
      chatId,
      communicationRequestTemplate({ username, role })
    )

    db.set('pendingMessages', without(pendingMessages, pendingMessage))
  }

  db.delete('pendingMessages')
}, 1000)

const sendQuestion = (chatId: number, s: number, q: '1' | '2' | '3', mode: 'cron' | 'demo') => {
  let text: string

  switch (q) {
    case '1':
      text = question1Template({})

      break
    case '2':
      text = question2Template({})

      break
    case '3':
      text = question3Template({})

      break
  }

  return bot.telegram.sendMessage(
    chatId,
    text,
    Markup.inlineKeyboard([
      Markup.button.callback('1', `/a?s=${s}&q=${q}&sc=1&m=${mode}`),
      Markup.button.callback('2', `/a?s=${s}&q=${q}&sc=2&m=${mode}`),
      Markup.button.callback('3', `/a?s=${s}&q=${q}&sc=3&m=${mode}`),
      Markup.button.callback('4', `/a?s=${s}&q=${q}&sc=4&m=${mode}`),
      Markup.button.callback('5', `/a?s=${s}&q=${q}&sc=5&m=${mode}`),
    ])
  )
}

const sendCloseQuestion = (chatId: number, sessionId: number, mode: 'cron' | 'demo') => {
  return bot.telegram.sendMessage(
    chatId,
    closeQuestionTemplate({}),
    Markup.inlineKeyboard([
      Markup.button.callback('Да', `/cq?s=${sessionId}&a=1&m=${mode}`),
      Markup.button.callback('Нет', `/cq?s=${sessionId}&a=0&m=${mode}`)
    ])
  )
}

bot.use(session())

bot.start(async (ctx) => {
  const chats: number[] = db.get('chats') ?? []

  if (!chats.includes(ctx.chat.id)) {
    db.set('chats', [...chats, ctx.chat.id])
  }

  logger.info('A new user "%s" joined with id = %s', ctx.message.from.username, ctx.message.from.id)

  await ctx.sendMessage(welcome1Template({}))
  await ctx.sendMessage(welcome2Template({}))
})

bot.action(/\/cq\?s=(\d+)&a=(1|0)&m=(cron|demo)/, async (ctx) => {
  const s = Number(ctx.match[1])
  const a = ctx.match[2] === '1' ? true : false
  const mode = ctx.match[3] as 'cron' | 'demo'
  const messageId = ctx.update.callback_query.message!.message_id

  await bot.telegram.editMessageReplyMarkup(
    ctx.chat!.id,
    messageId,
    undefined,
    {
      inline_keyboard: [],
    }
  )

  if (a) {
    const m = await bot.telegram.sendMessage(
      ctx.chat!.id,
      'В ответе напишите, что вас беспокоит',
      Markup.forceReply()
    )

    let sessions: Session[]

    switch (mode) {
      case 'cron': {
        sessions = db.get('sessions') ?? []

        break
      }
      case 'demo': {
        sessions = demoStore.sessions

        break
      }
    }

    const session = sessions[s]

    session.textFeedbacksMessageIds.push(m.message_id)

    switch (mode) {
      case 'cron':
        db.set('sessions', sessions)

        break
      case 'demo':
        demoStore.sessions = sessions

        break
    }
  } else {
    await bot.telegram.sendMessage(
      ctx.chat!.id,
      thanksTemplate({})
    )
  }
})

bot.action(/\/a\?s=(\d)&q=(\d+)&sc=(\d+)&m=(demo|cron)/, async (ctx) => {
  const s = Number(ctx.match[1])
  const q = ctx.match[2] as '1' | '2' | '3'
  const sc = Number(ctx.match[3])
  const mode = ctx.match[4] as 'demo' | 'cron'
  let sessions: Session[]

  switch (mode) {
    case 'cron': {
      sessions = db.get('sessions') ?? []

      break
    }
    case 'demo': {
      sessions = demoStore.sessions

      break
    }
  }

  const session = sessions[s]

  if (!session) {
    await ctx.answerCbQuery('Ошибка: сессия не найдена')

    logger.error('Сессия с идентификатором %s не найдена', s)

    return
  }

  for (const answer of session.answers) {
    if (answer.chatId === ctx.chat!.id && answer.question == q) {
      await ctx.answerCbQuery('Вы уже отвечали на этот вопрос')

      return
    }
  }

  session.answeredChatIds = Array.from(new Set([...session.answeredChatIds, ctx.chat!.id]))

  const answer: SessionAnswer = {
    id: session.answers.length,
    ts: new Date().toISOString(),
    chatId: ctx.chat!.id!,
    question: q,
    score: sc
  }

  session.answers.push(answer)

  await ctx.answerCbQuery('Данные сохранены!')

  if (sc <= 3) {
    const m = await ctx.sendMessage('Расскажите, что не так:', Markup.forceReply())

    session.feedbackMessageIds[q] = m.message_id
  } else {
    switch (q) {
      case '1': {
        const m = await sendQuestion(ctx.chat!.id, s, '2', mode)

        session.questionsMessagesIds[2] = m.message_id

        break
      }
      case '2': {
        const m = await sendQuestion(ctx.chat!.id, s, '3', mode)

        session.questionsMessagesIds[3] = m.message_id

        break
      }
      case '3':
        await sendCloseQuestion(ctx.chat!.id, session.id, mode)

        break
    }
  }

  switch (mode) {
    case 'demo': {
      demoStore.sessions = sessions

      break
    }
    case 'cron': {
      db.set('sessions', sessions)

      break
    }
  }
})

const tryFindSessionAndQuestionToAnswerFeedback = async (ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) => {
  let sessions: Session[] = db.get('sessions') ?? []
  const replyToMessageId: number | undefined = Reflect.get(ctx.update.message, 'reply_to_message')?.message_id
  let mode: 'cron' | 'demo' = 'cron'
  const findSessionAndQuestion = (sessions: Session[], replyToMessageId: number) => {
    let session: Session;
    let question: '1' | '2' | '3'

    for (const s of sessions) {
      const { feedbackMessageIds } = s

      for (const [q, feedbackMessageId] of Object.entries(feedbackMessageIds)) {
        if (feedbackMessageId == null) {
          continue
        }

        if (feedbackMessageId === replyToMessageId) {
          session = s
          question = q as '1' | '2' | '3'

          break
        }
      }

      if (session! != null) {
        break
      }
    }

    return {
      session: session! as Session | undefined,
      question: question! as '1' | '2' | '3' | undefined
    }
  }

  if (replyToMessageId == null) {
    const text = Reflect.get(ctx.message, 'text') as string

    if (text.trim().toLowerCase() === 'тест') {
      await startSequence({ mode: 'demo', chatId: ctx.chat.id })
    }

    return {
      sessions: undefined,
      session: undefined,
      question: undefined,
      mode: undefined
    }
  }

  let { session, question } = findSessionAndQuestion(sessions, replyToMessageId)

  if (!session || !question) {
    mode = 'demo'
    sessions = demoStore.sessions;

    ({ session, question } = findSessionAndQuestion(sessions, replyToMessageId))

    if (!session || !question) {
      logger.warn("Session not found chat_id = %s", ctx.chat.id)

      return {
        sessions: undefined,
        session: undefined,
        question: undefined,
        mode: undefined
      }
    }
  }

  return {
    sessions,
    session,
    question,
    mode
  }
}

const tryFindSessionToTextFeedback = async (ctx: NarrowedContext<Context<Update>, Update.MessageUpdate<Message>>) => {
  let sessions: Session[] = db.get('sessions') ?? []
  const replyToMessageId: number | undefined = Reflect.get(ctx.update.message, 'reply_to_message')?.message_id
  let mode: 'cron' | 'demo' = 'cron'
  const findSession = (sessions: Session[], replyToMessageId: number) => {
    let session: Session;

    for (const s of sessions) {
      const { textFeedbacksMessageIds } = s

      for (const tfmid of textFeedbacksMessageIds) {
        if (tfmid === replyToMessageId) {
          session = s

          break
        }
      }

      if (session!) {
        break
      }
    }

    return session! as Session | undefined
  }

  if (replyToMessageId == null) {
    return {
      sessions: undefined,
      session: undefined,
      question: undefined,
      mode: undefined
    }
  }

  let session = findSession(sessions, replyToMessageId)

  if (!session) {
    sessions = demoStore.sessions
    mode = 'demo'
    session = findSession(sessions, replyToMessageId)

    if (!session) {
      logger.warn("Session not found chat_id = %s", ctx.chat.id)

      return {
        sessions: undefined,
        session: undefined,
        mode: undefined
      }
    }
  }

  return {
    sessions,
    session,
    mode
  }
}

bot.on('message', async (ctx, next) => {
  let { sessions, session, question, mode } = await tryFindSessionAndQuestionToAnswerFeedback(ctx)

  if (sessions && session && question && mode) {
    const answer = session.answers.find(({ chatId, question: q }) => {
      return chatId === ctx.chat.id && question === q
    })

    if (!answer) {
      logger.warn("Answer not found chatId = %s, question = %s", ctx.chat.id, question)

      return
    }

    answer.feedback = Reflect.get(ctx.message, 'text') as string

    switch (mode) {
      case 'cron': {
        db.set('sessions', sessions)

        break
      }
      case 'demo': {
        demoStore.sessions = sessions

        break
      }
    }

    switch (question) {
      case '1': {
        const m = await sendQuestion(ctx.chat.id, session.id, '2', mode)

        session.questionsMessagesIds[1] = m.message_id

        break
      }
      case '2': {
        const m = await sendQuestion(ctx.chat.id, session.id, '3', mode)

        session.questionsMessagesIds[2] = m.message_id

        break
      }
      case '3':
        await sendCloseQuestion(ctx.chat.id, session.id, mode)

        break
    }
  } else {
    ({ sessions, session, mode } = await tryFindSessionToTextFeedback(ctx));

    if (sessions && session && mode) {
      session.textFeedbacks.push({
        id: session.textFeedbacks.length,
        ts: new Date().toISOString(),
        chatId: ctx.chat.id,
        feedback: Reflect.get(ctx.message, 'text') as string
      })

      switch (mode) {
        case 'cron': {
          db.set('sessions', sessions)

          break
        }
        case 'demo': {
          demoStore.sessions = sessions

          break
        }
      }

      await bot.telegram.sendMessage(
        ctx.chat!.id,
        thanksTemplate({})
      )
    } else {
      // Do nothing yet
    }
  }

  await next()
})

bot.on('message', async (ctx, next) => {
  const text = Reflect.get(ctx.message, 'text') as string
  const freeFormFeedbacks: FreeFormFeedback[] = db.get('freeFormFeedbacks') ?? []
  const id = freeFormFeedbacks.length

  db.set('freeFormFeedbacks', [
    ...freeFormFeedbacks,
    {
      id,
      text,
      ts: new Date().toISOString()
    } satisfies FreeFormFeedback
  ])

  await bot.telegram.sendMessage(
    ctx.chat.id,
    freeFormFeedbackTemplate({}),
    Markup.inlineKeyboard([
      [Markup.button.callback('Да, отправить фидбек по работе', `/faf?fid=${id}` /* Feedback Anonymous Feedback */)],
      [Markup.button.callback('Нет, задать вопрос разработчикам', `/ftq?fid=${id}` /* Feedback Team Question */)]
    ])
  )

  await next()
})

bot.action(/\/f(af|tq)\?fid=(\d+)/, async (ctx, next) => {
  const kind = ctx.match[1] as 'af' | 'tq'
  const fid = Number(ctx.match[2])
  const freeFormFeedbacks: FreeFormFeedback[] = db.get('freeFormFeedbacks') ?? []
  const item = freeFormFeedbacks[fid]

  switch (kind) {
    case 'af':
      item.kind = 'anonymous-feedback'

      await ctx.answerCbQuery('Ваше сообщение отправлено!')

      break
    case 'tq':
      item.kind = 'team-question'

      await ctx.answerCbQuery('Спасибо! Мы учтем фидбек в новых версиях бота')

      break
  }

  db.set('freeFormFeedbacks', freeFormFeedbacks)

  await next()
})

const startSequence = async ({
  mode,
  chatId
}: {
  mode: 'cron'
  chatId: void
} | {
  mode: 'demo'
  chatId: number
}) => {
  let chats: number[]
  let sessions: Session[]
  let session: Session

  switch (mode) {
    case 'cron': {
      chats = db.get('chats')

      if (chats.length === 0) {
        return
      }

      sessions = db.get('sessions') ?? []

      break
    }
    case 'demo': {
      chats = [chatId]
      sessions = demoStore.sessions

      break
    }
  }

  session = {
    id: sessions.length,
    ts: new Date().toISOString(),
    tz: timezone,
    answeredChatIds: [],
    answers: [],
    questionsMessagesIds: {
      1: null,
      2: null,
      3: null
    },
    feedbackMessageIds: {
      1: null,
      2: null,
      3: null
    },
    textFeedbacks: [],
    textFeedbacksMessageIds: []
  }

  for (const chatId of chats) {
    try {
      const m = await sendQuestion(chatId, session.id, '1', mode)

      session.questionsMessagesIds[1] = m.message_id
    } catch (e) {
      logger.error(e)
    }
  }

  switch (mode) {
    case 'cron': {
      db.set('sessions', [...sessions, session])

      break
    }
    case 'demo': {
      demoStore.sessions = [...sessions, session]

      break
    }
  }
}

cron.schedule(
  '0 19 * * FRI',
  () => startSequence({ mode: 'cron', chatId: undefined }),
  { timezone }
)

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.launch()
