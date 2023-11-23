import { type Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pollAnswer', table => {
    table.increments('id')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pollAnswer')
