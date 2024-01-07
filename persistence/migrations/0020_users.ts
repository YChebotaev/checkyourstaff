import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('users', table => {
    table.increments('id')

    table.string('name').nullable()
    table.string('email').nullable()
    table.string('phone').nullable()

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('users')
