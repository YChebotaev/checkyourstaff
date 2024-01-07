import { knex } from './knex'
import { logger } from './logger'
import type { User } from './types'

export const userCreate = async () => {
  const [{ id }] = await knex
    .insert({
      createdAt: knex.fn.now()
    })
    .into('users')
    .returning('id')

  logger.info('User created with id = %s', id)

  return id as number
}

export const userGet = async (id: number) => {
  const user = await knex
    .select('*')
    .from('users')
    .where('id', id)
    .first<User>()

  if (!user) {
    logger.warn('User with id = %s not found', id)

    return
  }

  if (user.deleted) {
    logger.warn("User with id = %s was found but deleted", id)

    return
  }

  return user
}

export const userDelete = async (id: number) => {
  await knex('users')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('User with id = %s deleted', id)
}
