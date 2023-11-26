import { knex } from './knex'

export const createAccount = async () => {
  const [{ id }] = await knex('account')
    .insert({ })
    .into('account')
    .returning('id')

  return id
}
