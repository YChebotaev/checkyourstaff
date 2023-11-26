import { knex } from './knex'

export const createPoll = async ({ accountId }: { accountId: number }) => {
  const [{ id }] = await knex('poll')
    .insert({ accountId })
    .into('poll')
    .returning('id')

    return id
}
