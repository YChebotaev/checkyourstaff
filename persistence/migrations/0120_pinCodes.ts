import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pinCodes', table => {
    table.increments('id')

    table.integer('pinCodeGeneratorId')
    table.integer('accountId')
    table.integer('sampleGroupId')

    table.string('code')
    table.boolean('used')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('pinCodeGeneratorId')
      .references('id')
      .inTable('pinCodeGenerators')
    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')

    table.index('code')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pinCodes')
