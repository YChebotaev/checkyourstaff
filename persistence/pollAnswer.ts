import { knex } from './knex'

export const createPollAnswer = async ({
  pollSectionId
}: {
  pollSectionId: number
}) => {
  const [{ id }] = await knex('pollAnswer')
    .insert({ pollSectionId })
    .into('pollAnswer')
    .returning('id')

  return id as number
}
