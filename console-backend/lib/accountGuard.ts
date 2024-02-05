import { logger } from "./logger";
import { getAccountsOfUser } from "./getAccountsOfUser";

export const accountGuard = async ({
  tgUserId,
  accountId,
}: {
  tgUserId: number;
  accountId: number;
}) => {
  const accounts = await getAccountsOfUser({ tgUserId });

  for (const account of accounts) {
    if (account.id === accountId) {
      return true;
    }
  }

  logger.error(
    "Tg user id = %s cannot have access to account with id = %s",
    tgUserId,
    accountId,
  );

  throw new Error(
    `Tg user id = ${tgUserId} cannot have access to account with id = ${accountId}`,
  );
};
