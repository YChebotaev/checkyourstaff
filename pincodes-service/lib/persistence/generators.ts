import { knex } from '../knex'
import type { Generator } from './types'

export const generatorCreate = async ({ tenantId }: { tenantId: number }) => {
  const [{ id }] = await knex
    .insert({
      tenantId,
      size: 4,
      generatedCount: 0,
      createdAt: new Date().getTime()
    })
    .into('generators')
    .returning<{ id: number }[]>('id')

  return id
}

export const generatorSetGeneratedCount = async (id: number, generatedCount: number) => {
  await knex('generators')
    .update({
      generatedCount,
      updatedAt: new Date().getTime()
    })
    .where('id', id)
    .returning('id')
}

export const generatorSetSize = async (id: number, size: number) => {
  await knex('generators')
    .update({
      size,
      updatedAt: new Date().getTime()
    })
    .where('id', id)
    .returning('id')
}

export const generatorGetByTenantId = async (tenantId: number) => {
  const generator = await knex
    .select('*')
    .from('generators')
    .where('tenantId', tenantId)
    .first<Generator>()

  if (!generator || generator.deleted) {
    return
  }

  return generator
}
