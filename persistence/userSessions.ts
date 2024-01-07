import { knex } from './knex'
import { logger } from './logger'
import type { UserSession } from './types'

export const userSessionCreate = async ({
  userId,
  chatId,
}: {
  userId: number
  chatId: number
}) => {
  const [{ id }] = await knex
    .insert({
      userId,
      chatId,
      createdAt: knex.fn.now()
    })
    .into('userSessions')
    .returning('id')

  logger.info('User session created with id = %s', id)

  return id as number
}

export const userSessionGet = async (id: number) => {
  const userSession = await knex
    .select('*')
    .from('userSessions')
    .where('id', id)
    .first<UserSession>()

  if (!userSession) {
    logger.warn("User session with id = %s not found", id)

    return
  }

  if (userSession.deleted) {
    logger.warn("User session with id = %s was found, but deleted", id)

    return
  }

  return userSession
}

export const userSessionGetByChatId = async (chatId: number) => {
  const userSession = await knex
    .select('*')
    .from('userSessions')
    .where('chatId', chatId)
    .first<UserSession>()

  if (!userSession) {
    logger.warn('User session with chat id = %s not found', chatId)

    return
  }

  if (userSession.deleted) {
    logger.warn("User session with id = %s were found but deleted", userSession.id)

    return
  }

  return userSession
}

export const userSessionGetByUserId = async (userId: number) => {
  const userSession = await knex
    .select('*')
    .from('userSessions')
    .where('userId', userId)
    .first<UserSession>()

  if (!userSession) {
    logger.warn('User session with user id = %s not found', userId)

    return
  }

  if (userSession.deleted) {
    logger.warn("User session with id = %s were found but deleted", userSession.id)

    return
  }

  return userSession
}

export const userSessionDelete = async (id: number) => {
  await knex('userSessions')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('User session with id = %s deleted', id)
}
