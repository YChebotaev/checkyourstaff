import { Telegraf } from "telegraf"

export const createBot = (token: string) => {
  const bot = new Telegraf(token)

  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))

  return bot
}
