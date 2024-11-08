import { createHash, createHmac } from "node:crypto";
import jwt from "jsonwebtoken";
import type { AuthVerifyQuery, TokenPayoad } from "../types";

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

export const createToken = (query: AuthVerifyQuery) => {
  const payload: TokenPayoad = {
    tgUserId: Number(query.id),
    firstName: query.first_name,
    lastName: query.last_name,
    username: query.username,
    photoUrl: query.photo_url,
  };

  return jwt.sign(payload, process.env["JWT_SECRET"]!);
};

export const authVerify = (
  query: AuthVerifyQuery,
): {
  valid: boolean;
  token?: string;
} => {
  const valid = isValid(query);

  if (valid) {
    const token = createToken(query);

    return { valid, token };
  }

  return { valid };
};
