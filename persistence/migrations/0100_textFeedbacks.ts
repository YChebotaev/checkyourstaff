import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("textFeedbacks", (table) => {
    table.increments("id");

    table.integer("pollQuestionId").nullable();
    table.integer("pollSessionId").nullable();
    table.integer("userId");
    table.integer("accountId");
    table.integer("sampleGroupId").nullable();
    table.integer("pollId").nullable();

    table.string("text");

    table.boolean("deleted").nullable();
    table.integer("createdAt");
    table.integer("updatedAt").nullable();

    table.foreign("pollQuestionId").references("id").inTable("pollQuestions");
    table.foreign("pollSessionId").references("id").inTable("pollSessions");
    table.foreign("userId").references("id").inTable("users");
    table.foreign("accountId").references("id").inTable("accounts");
    table.foreign("sampleGroupId").references("id").inTable("sampleGroups");
    table.foreign("pollId").references("id").inTable("polls");

    table.index("pollQuestionId");
    table.index("pollSessionId");
    table.index("userId");
    table.index("accountId");
    table.index("sampleGroupId");
    table.index("pollId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("textFeedbacks");
