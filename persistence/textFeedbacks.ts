import { knex } from './knex'
import { logger } from './logger'

export const textFeedbackCreate = async ({
  pollQuestionId,
  pollSessionId,
  text
}: {
  pollQuestionId?: number | null
  pollSessionId?: number | null
  text: string
}) => {
  const [{ id }] = await knex
    .insert({
      pollQuestionId,
      pollSessionId,
      text,
      createdAt: knex.fn.now()
    })
    .into('textFeedbacks')
    .returning('id')

  logger.info(
    'Poll answer created with id = %s for poll question id = %s',
    id,
    pollQuestionId
  )

  return id as number
}
