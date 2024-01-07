import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pollSessions', table => {
    table.increments('id')

    table.integer('accountId')
    table.integer('pollId')
    table.integer('sampleGroupId')

    table.json('pollingState')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('pollId')
      .references('id')
      .inTable('polls')
    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pollSessions')
