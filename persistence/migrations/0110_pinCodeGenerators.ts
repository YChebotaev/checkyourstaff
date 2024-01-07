import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pinCodeGenerators', table => {
    table.increments('id')

    table.integer('accountId')
    table.integer('sampleGroupId')

    table.integer('size')
    table.integer('generatedCount')

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
    
    table.index('accountId')
    table.index('sampleGroupId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pinCodeGenerators')
