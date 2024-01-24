import { accountAdministratorsGetByUserId } from "./accountAdministrators";
import { knex } from "./knex";
import { logger } from "./logger";
import type { Account } from "./types";

export const accountCreate = async ({ name }: { name: string }) => {
  const [{ id }] = await knex
    .insert({
      name,
      createdAt: new Date().getTime(),
    })
    .into("accounts")
    .returning("id");

  logger.info("Account created with id = %s", id);

  return id as number;
};

export const accountGet = async (id: number) => {
  const account = await knex
    .select("*")
    .from("accounts")
    .where("id", id)
    .first<Account>();

  if (!account) {
    logger.warn("Account with id = %s not found", id);

    return;
  }

  if (account.deleted) {
    logger.warn("Account with id = %s found but deleted", id);

    return;
  }

  return account;
};

export const accountIsExists = async (id: number) => {
  const data = await knex
    .select<Pick<Account, "deleted">>("deleted")
    .from("accounts")
    .where("id", id)
    .first();

  if (data != null) {
    return !data.deleted;
  }

  return false;
};

export const accountsGetByUserId = async (userId: number) => {
  const accountAdministrators = await accountAdministratorsGetByUserId(userId);
  const accounts: Account[] = [];

  for (const accountAdministrator of accountAdministrators) {
    const items = (
      await knex
        .select<Account[]>("*")
        .from("accounts")
        .where("id", accountAdministrator.accountId)
    ).filter(({ deleted }) => !deleted);

    accounts.push(...items);
  }

  return accounts;
};

export const accountDelete = async (id: number) => {
  await knex("accounts")
    .update({
      deleted: true,
      updatedAt: new Date().getTime(),
    })
    .where("id", id);

  logger.info("Account with id = %s deleted", id);
};
