import path from 'node:path'
import cron from 'node-cron'
import JSONDB from 'simple-json-db'
import { Telegraf, Markup } from 'telegraf'
import { mkdirpSync } from 'mkdirp'
import { readTemplate, logger } from './lib'
import type { Session, SessionAnswer } from './types'

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
const timezone = process.env['TZ'] ?? 'Europe/Moscow'
const db = new JSONDB(
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
      Markup.button.callback('1', `s=${s}&q=${q}&sc=1&m=${mode}`),
      Markup.button.callback('2', `s=${s}&q=${q}&sc=2&m=${mode}`),
      Markup.button.callback('3', `s=${s}&q=${q}&sc=3&m=${mode}`),
      Markup.button.callback('4', `s=${s}&q=${q}&sc=4&m=${mode}`),
      Markup.button.callback('5', `s=${s}&q=${q}&sc=5&m=${mode}`),
    ])
  )
}

bot.start(async (ctx) => {
  const chats: number[] = db.get('chats') ?? []

  if (!chats.includes(ctx.chat.id)) {
    db.set('chats', [...chats, ctx.chat.id])
  }

  logger.info('A new user "%s" joined with id = %s', ctx.message.from.username, ctx.message.from.id)

  await ctx.sendMessage(welcome1Template({}))
  await ctx.sendMessage(welcome2Template({}))
})

bot.action(/s=(\d)&q=(\d+)&sc=(\d+)&m=(demo|cron)/, async (ctx) => {
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
        await bot.telegram.sendMessage(
          ctx.chat!.id,
          thanksTemplate({})
        )

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

bot.on('message', async (ctx) => {
  let sessions: Session[] = db.get('sessions') ?? []
  const replyToMessageId: number | undefined = Reflect.get(ctx.update.message, 'reply_to_message')?.message_id
  let mode: 'cron' | 'demo' = 'cron'

  if (replyToMessageId == null) {
    const text = Reflect.get(ctx.message, 'text') as string

    if (text.trim().toLowerCase() === 'тест') {
      await startSequence({ mode: 'demo', chatId: ctx.chat.id })
    }

    return
  }

  let { session, question } = findSessionAndQuestion(sessions, replyToMessageId)

  if (!session || !question) {
    mode = 'demo'

    sessions = demoStore.sessions;

    ({ session, question } = findSessionAndQuestion(sessions, replyToMessageId))

    if (!session || !question) {
      logger.warn("Session not found chat_id = %s", ctx.chat.id)

      return
    }
  }

  const answer = session.answers.find(({ chatId, question: q }) => {
    return chatId === ctx.chat.id && question === q
  })

  if (!answer) {
    logger.warn("Answer not found chatId = %s, question = %s", ctx.chat.id, question)

    return
  }

  answer.feedback = Reflect.get(ctx.message, 'text') as string

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
      await bot.telegram.sendMessage(
        ctx.chat.id,
        thanksTemplate({})
      )

      break
  }

  db.set('sessions', sessions)
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
    }
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
