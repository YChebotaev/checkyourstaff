import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('jobs', table => {
    table.increments('id')

    table.integer('pollId')
    table.integer('sampleGroupId')

    table.string('type')
    table.string('cron')
    table.string('timeZone')

    table.boolean('deleted').nullable()
    table.dateTime('createdAt')
    table.dateTime('updatedAt').nullable()

    table.foreign('pollId')
      .references('id')
      .inTable('polls')
    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('jobs')
