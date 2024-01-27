import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");

    table.string("name").nullable();
    table.string("email").nullable();
    table.string("phone").nullable();
    table.string("username").nullable();
    table.string("firstName").nullable();
    table.string("lastName").nullable();
    table.string("languageCode").nullable();

    table.boolean("deleted").nullable();
    table.bigInteger("createdAt");
    table.integer("updatedAt").nullable();
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("users");
