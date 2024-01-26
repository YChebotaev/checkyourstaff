import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('sampleGroups', table => {
    table.increments('id')

    table.integer('accountId')

    table.string('name')

    table.boolean('deleted').nullable()
    table.integer('createdAt')
    table.integer('updatedAt').nullable()

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    
    table.index('accountId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('sampleGroups')
