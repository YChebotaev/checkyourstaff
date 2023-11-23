import { knex } from './knex'

export const createChatMetadata = async ({ tgChatId }: { tgChatId: number }) => {
  const [{ id }] = await knex('chatMetadata')
    .insert({ tgChatId })
    .into('chatMetadata')
    .returning('id')

  return id as number
}
