import { knex } from './knex'
import { logger } from './logger'
import { PollQuestion } from './types'

export const pollQuestionCreate = async ({
  accountId,
  pollId,
  text
}: {
  accountId: number
  pollId: number
  text: string
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      pollId,
      text,
      minScore: 1,
      maxScore: 5,
      textFeedbackRequestTreshold: 3,
      createdAt: knex.fn.now()
    })
    .into('pollQuestions')
    .returning('id')

  logger.info(
    'Poll question created with id = %s for account id = %s and text = "%s"',
    id,
    accountId,
    text
  )

  return id as number
}

export const pollQuestionGet = async (id: number) => {
  const pollQuestion = await knex
    .select('*')
    .from('pollQuestions')
    .where('id', id)
    .first<PollQuestion>()

  if (!pollQuestion) {
    logger.warn("Poll question with id = %s not found", id)

    return
  }

  if (pollQuestion.deleted) {
    logger.warn("Poll question with id = %s was found, but deleted", id)

    return
  }

  return pollQuestion
}

export const pollQuestionsGetByPollId = async (pollId: number) => {
  return (await knex
    .select<PollQuestion[]>('*')
    .from('pollQuestions')
    .where('pollId', pollId))
    .filter(pollQuestion => !pollQuestion.deleted)
}

export const pollQuestionDelete = async (id: number) => {
  await knex('pollQuestions')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Poll question with id = %s deleted', id)
}
