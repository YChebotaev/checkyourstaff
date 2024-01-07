import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('responders', table => {
    table.increments('id')

    table.integer('sampleGroupId')
    table.integer('userId')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('sampleGroupId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('responders')
