import { knex } from './knex'
import { logger } from './logger'
import type { Poll } from './types'

export const pollCreate = async ({
  accountId,
  name
}: {
  accountId: number
  name: string
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      name,
      createdAt: knex.fn.now()
    })
    .into('polls')
    .returning('id')

  logger.info(
    'Poll created with id = %s for account id = %s and name = "%s"',
    id,
    accountId,
    name
  )

  return id as number
}

export const pollGet = async (id: number) => {
  const poll = await knex
    .select('*')
    .from('polls')
    .where('id', id)
    .first<Poll>()

  if (!poll) {
    logger.warn('Poll with id = %s not found', id)

    return
  }

  if (poll.deleted) {
    logger.warn('Poll with id = %s found but deleted', id)

    return
  }

  return poll
}

export const pollsGetByAccountId = async (accountId: number) => {
  return (await knex
    .select<Poll[]>('*')
    .from('polls')
    .where('accountId', accountId))
    .filter(poll => !poll.deleted)
}

export const pollDelete = async (id: number) => {
  await knex('polls')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Poll with id = %s deleted', id)
}
