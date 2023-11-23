import { type Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('chatMetadata', table => {
    table.increments('id')
    table.integer('tgChatId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('chatMetadata')
