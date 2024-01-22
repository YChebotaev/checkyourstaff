import { createHash, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import {
  accountsGetByUserId,
  userSessionGetByTgUserId,
} from "@checkyourstaff/persistence";
import type { AuthVerifyQuery, TokenPayoad } from "../types";
import { logger } from "@checkyourstaff/persistence/logger";

const isValid = (query: AuthVerifyQuery) => {
  const botToken = process.env["CONTROL_BOT_TOKEN"]!;
  const secretKey = createHash("sha256").update(botToken).digest();
  const dataCheckString = Object.entries(query)
    .filter(([key]) => key !== "hash")
    .map(([key, value]) => `${key}=${value}`)
    .sort((a, b) => a.localeCompare(b))
    .join("\n");
  const hash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return query.hash === hash;
};

const createToken = (payload: TokenPayoad) => {
  return jwt.sign(payload, process.env["JWT_SECRET"]!);
};

export const authVerify = async (query: AuthVerifyQuery) => {
  const valid = isValid(query);

  if (valid) {
    const tgUserId = Number(query.id);
    // const userSession = await userSessionGetByTgUserId("control", tgUserId);

    // if (!userSession) {
    //   logger.error(
    //     "User session by tg user id = %s not found or deleted",
    //     tgUserId,
    //   );

    //   throw new Error(
    //     `User session by tg user id = ${tgUserId} not found or deleted`,
    //   );
    // }

    const token = createToken({
      userId: 1, // userSession.userId,
    });

    // const accounts = await accountsGetByUserId(userSession.userId);

    // if (accounts.length === 1) {
    //   return { valid, token, accountId: accounts[0].id };
    // }

    return { valid, token, accountId: 1 };
  }

  return { valid };
};
