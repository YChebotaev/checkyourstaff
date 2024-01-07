import { knex } from './knex'
import { logger } from './logger'

export const pollAnswerCreate = async ({
  pollQuestionId,
  pollSessionId,
  score
}: {
  pollQuestionId: number
  pollSessionId: number
  score: number
}) => {
  const [{ id }] = await knex
    .insert({
      pollQuestionId,
      pollSessionId,
      score,
      createdAt: knex.fn.now()
    })
    .into('pollAnswers')
    .returning('id')

  logger.info(
    'Poll answer created with id = %s for poll question id = %s with score = %s',
    id,
    pollQuestionId,
    score
  )

  return id as number
}
