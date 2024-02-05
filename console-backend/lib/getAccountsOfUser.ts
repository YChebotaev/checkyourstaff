import {
  userSessionGetByTgUserId,
  accountsGetByUserId,
} from "@checkyourstaff/persistence";
import { logger } from "./logger";

export const getAccountsOfUser = async ({ tgUserId }: { tgUserId: number }) => {
  const userSession = await userSessionGetByTgUserId("control", tgUserId);

  if (!userSession) {
    logger.error(
      "User session by tg user id = %s not found or deleted",
      tgUserId,
    );

    throw new Error(
      `User session by tg user id = ${tgUserId} not found or deleted`,
    );
  }

  return accountsGetByUserId(userSession.userId);
};
