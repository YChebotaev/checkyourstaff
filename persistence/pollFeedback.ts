import { knex } from './knex'

export const createPollFeedback = async ({
  pollSectionId
}: {
  pollSectionId: number
}) => {
  const [{ id }] = await knex('pollFeedback')
    .insert({ pollSectionId })
    .into('pollFeedback')
    .returning('id')

  return id as number
}
