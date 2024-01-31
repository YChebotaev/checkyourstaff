import { Knex } from "knex";
import { ChatState, ChatStateType } from "../types";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("userSessions", (table) => {
    table.increments("id");

    table.enum("type", ["control", "polling"]);
    table.integer("userId");
    table.integer("tgChatId");
    table.integer("tgUserId");

    table.json("chatState").defaultTo(
      JSON.stringify({
        name: "init",
      } satisfies ChatState),
    );

    table.boolean("deleted");
    table.bigInteger("createdAt");
    table.bigInteger("updatedAt");

    table.foreign("userId").references("id").inTable("users");

    table.index("type");
    table.index("userId");
    table.index("tgChatId");
    table.index("tgUserId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("userSessions");
