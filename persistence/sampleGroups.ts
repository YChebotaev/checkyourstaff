import { knex } from './knex'
import { logger } from './logger'
import type { SampleGroup } from './types'

export const sampleGroupCreate = async ({
  name,
  accountId
}: {
  name: string
  accountId: number
}) => {
  const [{ id }] = await knex
    .insert({
      name,
      accountId,
      createdAt: new Date().getTime()
    })
    .into('sampleGroups')
    .returning('id')

  logger.info(
    'Account administrator created with id = %s for account id = %s',
    id,
    accountId
  )

  return id as number
}

export const sampleGroupGet = async (id: number) => {
  const sampleGroup = await knex
    .select('*')
    .from('sampleGroups')
    .where('id', id)
    .first<SampleGroup>()

  if (!sampleGroup) {
    logger.warn('Sample group with id = %s not found', id)

    return
  }

  if (sampleGroup.deleted) {
    logger.warn('Sample group with id = %s found but deleted', id)

    return
  }

  return sampleGroup
}

export const sampleGroupIsExists = async (id: number) => {
  const data = await knex
    .select<Pick<SampleGroup, 'deleted'>>('deleted')
    .from('sampleGroups')
    .where('id', id)
    .first()

  if (data != null) {
    return !data.deleted
  }

  return false
}

export const sampleGroupsGetByAccountId = async (accountId: number) => {
  const sampleGroups = await knex
    .select<SampleGroup[]>('*')
    .from('sampleGroups')
    .where('accountId', accountId)

  return sampleGroups
    .filter(sampleGroup => sampleGroup.deleted == null) // TODO: Move this filter into query
}

export const sampleGroupDelete = async (id: number) => {
  await knex('sampleGroups')
    .update({
      deleted: true,
      updatedAt: new Date().getTime()
    })
    .where('id', id)

  logger.info('Sample group with id = %s deleted', id)
}
