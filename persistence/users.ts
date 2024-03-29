import { knex } from "./knex";
import { logger } from "./logger";
import type { User } from "./types";

export const userCreate = async ({
  username = null,
  firstName = null,
  lastName = null,
  languageCode = null,
}: {
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  languageCode?: string | null;
}) => {
  const [{ id }] = await knex
    .insert({
      username,
      firstName,
      lastName,
      languageCode,
      createdAt: new Date().getTime(),
    })
    .into("users")
    .returning("id");

  logger.info("User created with id = %s", id);

  return id as number;
};

export const userGet = async (id: number) => {
  const user = await knex
    .select("*")
    .from("users")
    .where("id", id)
    .first<User>();

  if (!user) {
    logger.warn("User with id = %s not found", id);

    return;
  }

  if (user.deleted) {
    logger.warn("User with id = %s was found but deleted", id);

    return;
  }

  return user;
};

export const userDelete = async (id: number) => {
  await knex("users")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("User with id = %s deleted", id);
};
