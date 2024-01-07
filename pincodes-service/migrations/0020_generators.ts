import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('generators', table => {
    table.increments('id')

    table.integer('tenantId')

    table.integer('size')
    table.integer('generatedCount')

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()

    table.foreign('tenantId')
      .references('id')
      .inTable('tenants')

    table.index('tenantId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('generators')
