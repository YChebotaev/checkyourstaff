import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pollQuestions', table => {
    table.increments('id')

    table.integer('accountId')
    table.integer('pollId')
    table.integer('aggregationIndex')

    table.string('text')
    table.integer('minScore')
    table.integer('maxScore')
    table.integer('textFeedbackRequestTreshold')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('pollId')
      .references('id')
      .inTable('polls')

    table.index('pollId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pollQuestions')
