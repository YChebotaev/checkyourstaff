import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userSessions", (table) => {
    table.increments("id");

    table.enum("type", ["control", "polling"]);
    table.integer("userId");
    table.integer("tgChatId");
    table.integer("tgUserId");

    table.json("chatState").defaultTo("noop");

    table.boolean("deleted");
    table.dateTime("createdAt");
    table.dateTime("updatedAt");

    table.foreign("userId").references("id").inTable("users");

    table.index("type");
    table.index("userId");
    table.index("tgChatId");
    table.index("tgUserId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userSessions");
