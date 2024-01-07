import { Telegraf } from "telegraf"
import { responderGet, userSessionGetByUserId } from "@checkyourstaff/persistence"
import { logger } from "./logger"

export const sendCloseMessage = async (
  bot: Telegraf,
  responderId: number
) => {
  const responder = await responderGet(responderId)

  if (!responder) {
    logger.warn('Responder with id = %s not found or deleted', responderId)

    return
  }

  const userSession = await userSessionGetByUserId(responder.userId)

  if (!userSession) {
    logger.warn('User session with userId = %s not found or deleted', responder.userId)

    return
  }

  await bot.telegram.sendMessage(
    userSession.chatId,
    'Спасибо за участие в опросе. Ваши оценки и комментарии учтены!'
  )
}