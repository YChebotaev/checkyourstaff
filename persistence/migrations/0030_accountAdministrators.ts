import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('accountAdministrators', table => {
    table.increments('id')

    table.integer('accountId')
    table.integer('userId')

    table.boolean('deleted').nullable()
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('accountId')
    table.index('userId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('accountAdministrators')
