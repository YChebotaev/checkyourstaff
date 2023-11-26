import { type Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('session', table => {
    table.increments('id')
    table.integer('chatId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('session')
