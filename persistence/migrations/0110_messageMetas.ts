import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("messageMetas", (table) => {
    table.increments("id");

    table.integer("accountId").nullable();
    table.integer("sampleGroupId").nullable();
    table.integer("userId");

    table.integer("messageId").nullable(); // Maybe remove
    table.integer("tgChatId").nullable(); // Maybe remove
    table.integer("pollId").nullable(); // Maybe remove
    table.integer("pollQuestionId").nullable(); // Maybe remove
    table.integer("pollSessionId").nullable(); // Maybe remove
    table.integer("responderId").nullable(); // Maybe remove
    table.integer("userSessionId").nullable();
    table.enum("type", ["enter-pin", "enter-free-form-feedback"]);

    table.boolean("deleted").nullable();
    table.bigInteger("createdAt");
    table.bigInteger("updatedAt").nullable();

    table.foreign("accountId").references("id").inTable("accounts");
    table.foreign("sampleGroupId").references("id").inTable("sampleGroups");
    table.foreign("userId").references("id").inTable("users");

    table.index("accountId");
    table.index("sampleGroupId");
    table.index("userId");
    table.index("messageId"); // Maybe remove
    table.index("tgChatId"); // Maybe remove
    table.index("userSessionId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("messageMetas");
