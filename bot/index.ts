import path from 'node:path'
import cron from 'node-cron'
import JSONDB from 'simple-json-db'
import { Telegraf, Markup } from 'telegraf'
import { mkdirpSync } from 'mkdirp'
import { readTemplate, logger, saveAnswer } from './lib'
import type { Session } from './types'

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

if (!token) {
  throw new Error("Bot must have BOT_TOKEN env variable set")
}

const bot = new Telegraf(token)

bot.start(async (ctx) => {
  const chats: number[] = db.get('chats') ?? []

  if (!chats.includes(ctx.chat.id)) {
    db.set('chats', [...chats, ctx.chat.id])
  }

  logger.info('A new user "%s" joined with id = %s', ctx.message.from.username, ctx.message.from.id)

  await ctx.sendMessage(welcome1Template({}))
  await ctx.sendMessage(welcome2Template({}))
})

bot.action(/s=(\d)&q=(\d+)&sc=(\d+)/, async (ctx) => {
  const s = Number(ctx.match[1])
  const q = ctx.match[2] as '1' | '2' | '3'
  const sc = Number(ctx.match[3])

  const sessions: Session[] = db.get('sessions') ?? []
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
  session.answers.push({
    ts: new Date().toISOString(),
    chatId: ctx.chat!.id!,
    question: q,
    score: sc
  })

  db.set('sessions', sessions)

  await ctx.answerCbQuery('Данные сохранены!')

  await saveAnswer(ctx.update.callback_query.from.id, q, sc)

  switch (q) {
    case '1':
      await bot.telegram.sendMessage(
        ctx.chat!.id,
        question2Template({}),
        Markup.inlineKeyboard([
          Markup.button.callback('1', `s=${s}&q=2&sc=1`),
          Markup.button.callback('2', `s=${s}&q=2&sc=2`),
          Markup.button.callback('3', `s=${s}&q=2&sc=3`),
          Markup.button.callback('4', `s=${s}&q=2&sc=4`),
          Markup.button.callback('5', `s=${s}&q=2&sc=5`),
        ])
      )

      break
    case '2':
      await bot.telegram.sendMessage(
        ctx.chat!.id,
        question3Template({}),
        Markup.inlineKeyboard([
          Markup.button.callback('1', `s=${s}&q=3&sc=1`),
          Markup.button.callback('2', `s=${s}&q=3&sc=2`),
          Markup.button.callback('3', `s=${s}&q=3&sc=3`),
          Markup.button.callback('4', `s=${s}&q=3&sc=4`),
          Markup.button.callback('5', `s=${s}&q=3&sc=5`),
        ])
      )

      break
    case '3':
      await bot.telegram.sendMessage(
        ctx.chat!.id,
        thanksTemplate({})
      )

      break
  }
})

cron.schedule('0 19 * * FRI', async () => {
  const chats = db.get('chats')

  if (chats.length === 0) {
    return
  }

  const sessions: Session[] = db.get('sessions') ?? []
  const session: Session = {
    id: sessions.length,
    ts: new Date().toISOString(),
    tz: timezone,
    answeredChatIds: [],
    answers: []
  }

  db.set('sessions', [...sessions, session])

  for (const chatId of chats) {
    try {
      await bot.telegram.sendMessage(
        chatId,
        question1Template({}),
        Markup.inlineKeyboard([
          Markup.button.callback('1', `s=${session.id}&q=1&sc=1`),
          Markup.button.callback('2', `s=${session.id}&q=1&sc=2`),
          Markup.button.callback('3', `s=${session.id}&q=1&sc=3`),
          Markup.button.callback('4', `s=${session.id}&q=1&sc=4`),
          Markup.button.callback('5', `s=${session.id}&q=1&sc=5`),
        ])
      )
    } catch (e) {
      logger.error(e)
    }
  }
}, {
  timezone
})

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

bot.launch()
