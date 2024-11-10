import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("pollAnswers", (table) => {
    table.increments("id");

    table.integer("pollQuestionId");
    table.integer("pollSessionId");
    table.integer("userId");
    table.integer("sampleGroupId");
    table.integer("accountId");

    table.integer("score");

    table.boolean("deleted").nullable();
    table.bigInteger("createdAt");
    table.bigInteger("updatedAt").nullable();

    table.foreign("pollQuestionId").references("id").inTable("pollQuestions");
    table.foreign("pollSessionId").references("id").inTable("pollSessions");

    table.index("pollQuestionId");
    table.index("pollSessionId");
    table.index("userId");
    table.index("sampleGroupId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("pollAnswers");
