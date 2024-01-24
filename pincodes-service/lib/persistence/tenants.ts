import { knex } from '../knex'

export const tenantCreate = async ({ name }: { name: string }) => {
  const [{ id }] = await knex
    .insert({
      name,
      createdAt: new Date().getTime()
    })
    .into('tenants')
    .returning<{ id: number }[]>('id')

  return id
}
