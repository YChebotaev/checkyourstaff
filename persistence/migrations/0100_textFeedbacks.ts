import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('textFeedbacks', table => {
    table.increments('id')

    table.integer('pollQuestionId').nullable()
    table.integer('pollSessionId').nullable()

    table.string('text')

    table.boolean('deleted')
    table.dateTime('createdAt')
    table.dateTime('updatedAt')

    table.foreign('pollQuestionId')
      .references('id')
      .inTable('pollQuestions')
    table.foreign('pollSessionId')
      .references('id')
      .inTable('pollSessions')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('textFeedbacks')
