import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pinCodes', table => {
    table.increments('id')

    table.integer('tenantId')
    table.integer('generatorId')

    table.integer('code')
    table.json('payload')

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()

    table.foreign('tenantId')
      .references('id')
      .inTable('tenants')
    table.foreign('generatorId')
      .references('id')
      .inTable('generators')

    table.index('code')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pinCodes')
