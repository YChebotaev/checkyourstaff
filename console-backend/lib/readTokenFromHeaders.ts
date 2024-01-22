import { type IncomingHttpHeaders } from "node:http";
import jwt from "jsonwebtoken";
import type { TokenPayoad } from "../types";

export const readTokenFromHeaders = (headers: IncomingHttpHeaders) => {
  const authorizationStr = headers.authorization;

  if (!authorizationStr) {
    return;
  }

  const tokenStr = authorizationStr.slice(7);

  return jwt.decode(tokenStr) as TokenPayoad;
};
