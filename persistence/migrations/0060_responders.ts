import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('responders', table => {
    table.increments('id')

    table.integer('sampleGroupId')
    table.integer('userId')

    table.boolean('deleted')
    table.integer('createdAt')
    table.integer('updatedAt')

    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('sampleGroupId')
    table.index('userId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('responders')
