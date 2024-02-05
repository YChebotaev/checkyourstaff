import { type IncomingHttpHeaders } from "node:http";
import { readTokenFromHeaders } from "./readTokenFromHeaders";
import { logger } from "./logger";

export const tokenGuard = (headers: IncomingHttpHeaders) => {
  const parsedToken = readTokenFromHeaders(headers);

  if (!parsedToken) {
    logger.error("Cannot read and/or parse token from headers");

    throw new Error("Cannot read and/or parse token from headers");
  }

  return parsedToken;
};
