import { knex } from "./knex";
import { logger } from "./logger";
import type { AccountAdministrator } from "./types";

export const accountAdministratorCreate = async ({
  accountId,
  userId,
}: {
  accountId: number;
  userId: number;
}) => {
  const [{ id }] = await knex
    .insert({
      accountId,
      userId,
      createdAt: knex.fn.now(),
    })
    .into("accountAdministrators")
    .returning("id");

  logger.info(
    "Account administrator created with id = %s for account id = %s for user id = %s",
    id,
    accountId,
    userId,
  );

  return id as number;
};

export const accountAdministratorGetByAccountIdAndUserId = async (
  accountId: number,
  userId: number,
) => {
  const accountAdministrator = await knex
    .select("*")
    .from("accountAdministrators")
    .where("accountId", accountId)
    .andWhere("userId", userId)
    .first<AccountAdministrator>();

  if (!accountAdministrator) {
    logger.warn(
      "Account administrator with accountId = %s and userId = %s not found",
      accountId,
      userId,
    );

    return;
  }

  if (accountAdministrator.deleted) {
    logger.warn(
      "Account administrator with accountId = %s and userId = %s found but deleted",
      accountId,
      userId,
    );

    return;
  }

  return accountAdministrator;
};

export const accountAdministratorsGetByUserId = async (userId: number) => {
  const accountAdministrators = await knex
    .select<AccountAdministrator[]>("*")
    .from("accountAdministrators")
    .where("userId", userId);

  return accountAdministrators.filter(({ deleted }) => !deleted);
};

export const accountAdministratorDelete = async (id: number) => {
  await knex("accountAdministrators")
    .update({
      deleted: true,
      updatedAt: knex.fn.now(),
    })
    .where("id", id);

  logger.info("Account administrator with id = %s deleted", id);
};
