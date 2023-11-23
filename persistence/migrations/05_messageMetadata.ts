import { type Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('messageMetadata', table => {
    table.increments('id')
    table.integer('tgMessageId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('messageMetadata')
