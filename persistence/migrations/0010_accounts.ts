import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('accounts', table => {
    table.increments('id')

    table.string('name').nullable()

    table.boolean('deleted').nullable()
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('accounts')
