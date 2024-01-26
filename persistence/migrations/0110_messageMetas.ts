import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable('messageMetas', table => {
    table.increments('id')

    table.integer('accountId').nullable()
    table.integer('sampleGroupId').nullable()
    table.integer('userId')

    table.integer('messageId').nullable()
    table.integer('tgChatId').nullable()
    table.integer('pollId').nullable()
    table.integer('pollQuestionId').nullable()
    table.integer('pollSessionId').nullable()
    table.integer('responderId').nullable()
    table.string('type') // TODO: Заменить на enum

    table.boolean('deleted').nullable()
    table.bigInteger('createdAt')
    table.bigInteger('updatedAt').nullable()

    table.foreign('accountId')
      .references('id')
      .inTable('accounts')
    table.foreign('sampleGroupId')
      .references('id')
      .inTable('sampleGroups')
    table.foreign('userId')
      .references('id')
      .inTable('users')

    table.index('messageId')
    table.index('tgChatId')
  })

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable('messageMetas')
