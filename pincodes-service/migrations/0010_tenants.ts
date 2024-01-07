import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('tenants', table => {
    table.increments('id')

    table.string('name')

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('tenants')
