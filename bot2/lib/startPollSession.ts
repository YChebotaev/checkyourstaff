import {
  pollGet,
  sampleGroupGet,
  respondersGetBySampleGroupId,
  pollQuestionsGetByPollId,
  pollSessionCreate,
  pollSessionGet
} from "@checkyourstaff/persistence"
import { first } from "lodash"
import { type Telegraf } from "telegraf"
import { logger } from "./logger"
import { sendQuestionToResponder } from './sendQuestionToResponder'

export const startPollSession = async (
  bot: Telegraf,
  pollId: number,
  sampleGroupId: number
) => {
  const poll = await pollGet(pollId)
  const sampleGroup = await sampleGroupGet(sampleGroupId)
  const responders = await respondersGetBySampleGroupId(sampleGroupId)
  const pollQuestions = await pollQuestionsGetByPollId(pollId)

  if (!poll) {
    logger.warn('Poll with id = %s not found or deleted', pollId)

    return
  }

  if (!sampleGroup) {
    logger.warn('Sample group with id = %s not found or deleted', pollId)

    return
  }

  if (pollQuestions.length && responders.length) {
    const pollSessionId = await pollSessionCreate({
      pollId,
      accountId: poll?.accountId,
      sampleGroupId,
      pollingState: responders.reduce(
        (state, responder) =>
          Object.assign(
            state,
            {
              [responder.id]: pollQuestions.map(({ id }) => id)
            }
          ),
        {}
      )
    })
    const pollSession = await pollSessionGet(pollSessionId)

    if (!pollSession) {
      return
    }

    await Promise.all(responders.map(responder =>
      sendQuestionToResponder(
        bot,
        pollSession,
        first(pollQuestions)!,
        responder
      )
    ))
  }
}
