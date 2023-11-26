import { knex } from './knex'
import type { Session } from './types'

export const getSessionByChatId = async (chatId: number) => {
  return knex('session')
    .select<Session>()
    .from('session')
    .where({ chatId })
    .first()
}

export const createSession = async ({ chatId }: { chatId: number }) => {
  const [{ id }] = await knex('session')
    .insert({ chatId })
    .into('session')
    .returning('id')

  return id
}
