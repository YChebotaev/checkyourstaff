import { type Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pollMember', table => {
    table.increments('id')
    table.integer('pollId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pollMember')
