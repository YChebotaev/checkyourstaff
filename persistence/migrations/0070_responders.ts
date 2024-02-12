import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('responders', table => {
    table.increments('id')

    table.integer('sampleGroupId')
    table.integer('userId')
    table.integer('inviteId')

    table.boolean('deleted')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt')

    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
    table.foreign('userId')
      .references('id')
      .inTable('users')
    table.foreign('inviteId')
      .references('id')
      .inTable('invites')

    table.index('sampleGroupId')
    table.index('userId')
    table.index('inviteId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('responders')
