import { knex } from './knex'
import { logger } from './logger'
import type { PinCode } from './types'

export const pinCodeCreate = async ({
  accountId,
  sampleGroupId,
  code
}: {
  accountId: number,
  sampleGroupId: number,
  code: string
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      sampleGroupId,
      code,
      used: false,
      createdAt: knex.fn.now()
    })
    .into('pinCodes')
    .returning('id')

  logger.info(
    'Pin code created with id = %s for account id = %s and sample group id = %s',
    id,
    accountId,
    sampleGroupId
  )

  return id as number
}

export const isPinCodeExistsByCode = async (code: string) => {
  const data = await knex
    .select<Pick<PinCode, 'id'>>('id')
    .from('pinCodes')
    .where('code', code)
    .first()

  return data != null
}

export const pinCodeGetByCode = async (code: string) => {
  const pinCode = await knex
    .select('*')
    .from('pinCodes')
    .where('code', code)
    .first<PinCode>()

  if (!pinCode) {
    logger.warn("Pin code with code = %s was not found", code)

    return
  }

  if (pinCode.deleted) {
    logger.warn("Pin code with id = %s was found but deleted", pinCode.id)

    return
  }

  return pinCode
}

export const pinCodeMarkUsed = async (id: number) => {
  await knex('pinCodes')
    .update({
      used: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Pin code with id = %s marked as used', id)
}

export const pinCodeDelete = async (id: number) => {
  await knex('pinCodes')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Pin code generator with id = %s deleted', id)
}
