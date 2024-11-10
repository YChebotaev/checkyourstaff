import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('pollQuestions', table => {
    table.increments('id')

    table.integer('accountId')
    table.integer('pollId')
    table.integer('aggregationIndex')
    table.string('measurenmentName')

    table.string('text')
    table.integer('minScore')
    table.integer('maxScore')
    table.integer('textFeedbackRequestTreshold')

    table.boolean('deleted')
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt')

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('pollId')
      .references('id')
      .inTable('polls')

    table.index('pollId')
    table.index('accountId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('pollQuestions')
