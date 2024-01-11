import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('userSessions', table => {
    table.increments('id')

    table.integer('userId')
    table.integer('chatId')

    table.json('chatState').defaultTo('noop')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('chatId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('userSessions')
