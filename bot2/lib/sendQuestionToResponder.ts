import url from 'node:url'
import {
  PollSession,
  PollQuestion,
  Responder,
  userSessionGetByUserId
} from "@checkyourstaff/persistence"
import { Markup, type Telegraf } from "telegraf"
import { logger } from "./logger"

export const sendQuestionToResponder = async (
  bot: Telegraf,
  pollSession: PollSession,
  pollQuestion: PollQuestion,
  responder: Responder
) => {
  const userSession = await userSessionGetByUserId(responder.userId)

  if (!userSession) {
    logger.warn("User session by userId = %s not found", responder.userId)

    return
  }

  const generateKeyboard = (
    minScore: number,
    maxScore: number,
    textFeedbackRequestTreshold: number
  ) => {
    const buttons: any[] = [] // TODO: Replace any to something more meaningful

    for (let i = minScore; i <= maxScore; i++) {
      buttons.push(
        Markup.button.callback(`${i}`, url.format({
          pathname: '/sf' /* score_feedback */,
          query: {
            ri /* responderId */: responder.id,
            psi /* pollSessionId */: pollSession.id,
            pqi /* pollQuestionId */: pollQuestion.id,
            s /* score */: i,
            rtf /* requestTextFeedback */: i <= textFeedbackRequestTreshold ? '1' : '0'
          }
        }))
      )
    }

    return buttons
  }

  await bot.telegram.sendMessage(
    userSession.chatId,
    pollQuestion.text,
    Markup.inlineKeyboard([
      ...generateKeyboard(
        pollQuestion.minScore,
        pollQuestion.maxScore,
        pollQuestion.textFeedbackRequestTreshold
      )
    ])
  )
}