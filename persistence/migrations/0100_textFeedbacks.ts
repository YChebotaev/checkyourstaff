import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("textFeedbacks", (table) => {
    table.increments("id");

    table.integer("pollQuestionId").nullable();
    table.integer("pollSessionId").nullable();
    table.integer("userId");
    table.integer("accountId");
    table.integer("sampleGroupId");
    table.integer("pollId");

    table.string("text");

    table.boolean("deleted").nullable();
    table.dateTime("createdAt");
    table.dateTime("updatedAt").nullable();

    table.foreign("pollQuestionId").references("id").inTable("pollQuestions");
    table.foreign("pollSessionId").references("id").inTable("pollSessions");

    table.index("pollQuestionId");
    table.index("pollSessionId");
    table.index("userId");
    table.index("accountId");
    table.index("sampleGroupId");
    table.index("pollId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("textFeedbacks");
