import { knex } from './knex'
import { logger } from './logger'
import type { Responder } from './types'

export const responderCreate = async ({
  sampleGroupId,
  userId,
}: {
  sampleGroupId: number
  userId: number
}) => {
  const [{ id }] = await knex
    .insert({
      sampleGroupId,
      userId,
      createdAt: knex.fn.now()
    })
    .into('responders')
    .returning('id')

  logger.info(
    'Responder created with id = %s for sample group id = %s',
    id,
    sampleGroupId
  )

  return id as number
}

export const responderGet = async (id: number) => {
  const responder = await knex
    .select('*')
    .from('responders')
    .where('id', id)
    .first<Responder>()

  if (!responder) {
    logger.warn("Responder with id = %s not found", id)

    return
  }

  if (responder.deleted) {
    logger.warn("Responder with id = %s was found, but deleted", id)

    return
  }

  return responder
}

export const respondersGetBySampleGroupId = async (sampleGroupId: number) => {
  return (await knex
    .select<Responder[]>('*')
    .from('responders')
    .where('sampleGroupId', sampleGroupId))
    .filter(responder => !responder.deleted)
}

export const responderDelete = async (id: number) => {
  await knex('responders')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Responder with id = %s deleted', id)
}
