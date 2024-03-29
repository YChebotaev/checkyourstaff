import { Knex } from "knex";

export const up = async (knex: Knex): Promise<void> =>
  knex.schema.createTable("invites", (table) => {
    table.increments("id");

    table.integer("sampleGroupId");

    // table.string("email").nullable();
    // table.string("phone").nullable();
    table.json('contacts')

    table.boolean("deleted").nullable();
    table.bigInteger("createdAt");
    table.bigInteger("updatedAt").nullable();

    table.foreign("sampleGroupId").references("id").inTable("sampleGroups");

    table.index("sampleGroupId");
  });

export const down = async (knex: Knex): Promise<void> =>
  knex.schema.dropTable("invites");
