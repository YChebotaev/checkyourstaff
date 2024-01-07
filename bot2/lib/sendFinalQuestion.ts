import { pollSessionGet, responderGet, userSessionGetByUserId, messageMetaCreate } from "@checkyourstaff/persistence"
import { Markup, type Telegraf } from "telegraf"
import { logger } from "./logger"

export const sendFinalQuestion = async (
  bot: Telegraf,
  pollSessionId: number,
  responderId: number
) => {
  const pollSession = await pollSessionGet(pollSessionId)

  if (!pollSession) {
    logger.warn('Poll session with id = %s not found or deleted', pollSessionId)

    return
  }

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

  const { message_id } = await bot.telegram.sendMessage(
    userSession.chatId,
    'Хотите еще чем-то поделиться?',
    Markup.forceReply()
  )

  await messageMetaCreate({
    messageId: message_id,
    chatId: userSession.chatId,
    type: 'enter-final-feedback',
    pollSessionId
  })
}