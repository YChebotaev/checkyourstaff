import { pollSessionGet, pollQuestionGet, responderGet } from "@checkyourstaff/persistence"
import { first } from "lodash"
import { logger } from "./logger"
import { sendQuestionToResponder } from "./sendQuestionToResponder"
import { sendFinalQuestion } from './sendFinalQuestion'
import { type Telegraf } from "telegraf"

export const sendNextQuestion = async (
  bot: Telegraf,
  pollSessionId: number,
  responderId: number
) => {
  const pollSession = await pollSessionGet(pollSessionId)

  if (!pollSession) {
    return
  }

  const nextQuestionId = first(pollSession.pollingState[responderId])

  if (nextQuestionId) {
    const pollQuestion = await pollQuestionGet(nextQuestionId)

    if (!pollQuestion) {
      logger.warn('Poll question with id = %s not found or deleted', nextQuestionId)

      return
    }

    const responder = await responderGet(responderId)

    if (!responder) {
      logger.warn('Responder with id = %s not found or deleted', responderId)

      return
    }

    void sendQuestionToResponder(
      bot,
      pollSession,
      pollQuestion,
      responder
    )
      .catch(e => logger.error(e))
  } else {
    void sendFinalQuestion(bot, pollSessionId, responderId)
      .catch(e => logger.error(e))
  }
}