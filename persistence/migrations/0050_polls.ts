import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('polls', table => {
    table.increments('id')

    table.integer('accountId')

    table.string('name')

    table.boolean('deleted')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt')

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')

    table.index('accountId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('polls')
