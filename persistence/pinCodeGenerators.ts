import { knex } from './knex'
import { logger } from './logger'
import { isPinCodeExistsByCode, pinCodeCreate } from './pinCodes'
import type { PinCodeGenerator } from './types'

export const pinCodeGeneratorCreate = async ({
  accountId,
  sampleGroupId
}: {
  accountId: number,
  sampleGroupId: number
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      sampleGroupId,
      size: 4,
      generatedCount: 0,
      createdAt: knex.fn.now()
    })
    .into('pinCodeGenerators')
    .returning('id')

  logger.info(
    'Pin code generator created with id = %s for account id = %s and sample group id = %s',
    id,
    accountId,
    sampleGroupId
  )

  return id as number
}

export const pinCodeGeneratorGetBySampleGroupId = async (sampleGroupId: number) => {
  return knex
    .select('*')
    .from('pinCodeGenerators')
    .where('sampleGroupId', sampleGroupId)
    .first<PinCodeGenerator>()
}

export const pinCodeGeneratorGeneratePinCode = async (id: number) => {
  const data = await knex
    .select('id', 'size', 'generatedCount', 'accountId', 'sampleGroupId')
    .from('pinCodeGenerators')
    .where('id', id)
    .first<Pick<PinCodeGenerator, 'id' | 'size' | 'generatedCount' | 'accountId' | 'sampleGroupId'>>()

  if (data) {
    const { id: generatorId, size, generatedCount, accountId, sampleGroupId } = data

    const generatePinCode = (size: number) => {
      const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      const arr = new Array(size)

      for (let i = 0; i < size; i++) {
        arr[i] = numbers[Math.floor(Math.random() * numbers.length)]
      }

      return arr.join('')
    }

    let code: string
    let isPinCodeExists: boolean

    do {
      code = generatePinCode(size)
      isPinCodeExists = await isPinCodeExistsByCode(code)
    } while (isPinCodeExists)

    const id = await pinCodeCreate({
      accountId,
      sampleGroupId,
      code
    })

    await knex('pinCodeGenerators')
      .update({
        generatedCount: generatedCount + 1
      })

    logger.info(
      'Generated #%s pin code = %s for account id = %s and sample group id = %s',
      generatedCount + 1,
      code,
      accountId,
      sampleGroupId
    )

    return id
  } else {
    logger.error('Pin code generator with id = %s not found', id)
  }
}

export const pinCodeGeneratorDelete = async (id: number) => {
  await knex('pinCodeGenerators')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Pin code generator with id = %s deleted', id)
}
