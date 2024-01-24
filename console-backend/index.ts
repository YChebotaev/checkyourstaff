import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import {
  accountsGetByUserId,
  sampleGroupsGetByAccountId,
  textFeedbackDelete,
  textFeedbackGet,
  userSessionGetByUserId,
} from "@checkyourstaff/persistence";
import { pollingTelegram } from "@checkyourstaff/common/telegram";
import {
  logger,
  authVerify,
  readTokenFromHeaders,
  getStats,
  getCharts,
  getTextFeedback,
} from "./lib";
import type { AuthVerifyData, AuthVerifyQuery } from "./types";

const app = fastify({ logger });

app.register(fastifyCors, {
  origin: true,
  credentials: true,
});

app.get<{
  Querystring: AuthVerifyQuery;
}>("/auth/verify", {
  schema: {
    querystring: {
      type: "object",
      required: [
        "first_name",
        "last_name",
        "username",
        "photo_url",
        "auth_date",
        "hash",
      ],
      properties: {
        first_name: { type: "string" },
        last_name: { type: "string" },
        username: { type: "string" },
        photo_url: { type: "string" },
        auth_date: { type: "string" },
        hash: { type: "string" },
      },
    },
  },
  async handler({ query }) {
    const { valid, token, accountId } = await authVerify(query);

    if (!valid) {
      logger.error("Auth verify hash is invalid: %s", JSON.stringify(query));
    }

    return { valid, token, accountId } satisfies AuthVerifyData;
  },
});

app.get("/accounts", ({ headers }) => {
  const token = readTokenFromHeaders(headers);

  if (!token) {
    logger.error("Cannot read and/or parse token from headers");

    throw new Error("Cannot read and/or parse token from headers");
  }

  const { userId } = token;

  return accountsGetByUserId(userId);
});

app.get<{
  Querystring: {
    accountId: string;
  };
}>("/stats", async ({ headers, query: { accountId: accountIdStr } }) => {
  const token = readTokenFromHeaders(headers);

  if (!token) {
    logger.error("Cannot read and/or parse token from headers");

    throw new Error("Cannot read and/or parse token from headers");
  }

  const accountId = Number(accountIdStr);

  return getStats({ accountId });
});

app.get<{
  Querystring: {
    accountId: string;
  };
}>("/sampleGroups", async ({ headers, query: { accountId: accountIdStr } }) => {
  const token = readTokenFromHeaders(headers);

  if (!token) {
    logger.error("Cannot read and/or parse token from headers");

    throw new Error("Cannot read and/or parse token from headers");
  }

  const accountId = Number(accountIdStr);

  return sampleGroupsGetByAccountId(accountId);
});

app.get<{
  Querystring: {
    accountId: string;
    sampleGroupId: string;
  };
}>(
  "/charts",
  async ({
    headers,
    query: { accountId: accountIdStr, sampleGroupId: sampleGroupIdStr },
  }) => {
    const token = readTokenFromHeaders(headers);

    if (!token) {
      logger.error("Cannot read and/or parse token from headers");

      throw new Error("Cannot read and/or parse token from headers");
    }

    const accountId = Number(accountIdStr);
    const sampleGroupId = Number(sampleGroupIdStr);

    return getCharts({ accountId, sampleGroupId });
  },
);

app.get<{
  Querystring: {
    accountId: string;
  };
}>("/textFeedback", async ({ headers, query: { accountId: accountIdStr } }) => {
  const token = readTokenFromHeaders(headers);

  if (!token) {
    logger.error("Cannot read and/or parse token from headers");

    throw new Error("Cannot read and/or parse token from headers");
  }

  const accountId = Number(accountIdStr);

  return getTextFeedback({ accountId });
});

app.post<{
  Body: {
    feedbackId: string;
  };
}>("/deleteFeedback", {
  schema: {
    body: {
      type: "object",
      required: ["feedbackId"],
      properties: {
        feedbackId: { type: "string" },
      },
    },
  },
  async handler({ headers, body: { feedbackId: feedbackIdStr } }) {
    const token = readTokenFromHeaders(headers);

    if (!token) {
      logger.error("Cannot read and/or parse token from headers");

      throw new Error("Cannot read and/or parse token from headers");
    }

    const feedbackId = Number(feedbackIdStr);

    await textFeedbackDelete(feedbackId);
  },
});

app.post<{
  Body: {
    feedbackId: string;
    role: string;
    username: string;
  };
}>("/sendMessage", {
  schema: {
    body: {
      type: "object",
      required: ["feedbackId", "role", "username"],
      properties: {
        feedbackId: { type: "string" },
        role: { type: "string" },
        username: { type: "string" },
      },
    },
  },
  async handler({
    headers,
    body: { feedbackId: feedbackIdStr, role, username },
  }) {
    const token = readTokenFromHeaders(headers);

    if (!token) {
      logger.error("Cannot read and/or parse token from headers");

      throw new Error("Cannot read and/or parse token from headers");
    }

    const textFeedbackId = Number(feedbackIdStr);
    const textFeedback = await textFeedbackGet(textFeedbackId);

    if (!textFeedback) {
      throw new Error(
        `Text feedback with id = ${textFeedbackId} not found or deleted`,
      );
    }

    const userSession = await userSessionGetByUserId(textFeedback.userId);

    if (!userSession) {
      throw new Error(
        `User session with user id = ${textFeedback.userId} not found or deleted`,
      );
    }

    await pollingTelegram.sendMessage(
      userSession.tgChatId,
      `${role} прочитал ваш анонимный отзыв и хочет подробнее изучить ситуацию и обсудить её с вами. Если вам важно обсудить это, то вы можете лично написать в телеграм ${username}. Если хотите остаться анонимным, то просто проигнорируйте это сообщение`,
    );
  },
});

app.listen({
  port: Number(process.env["PORT"] ?? 3001),
  host: process.env["HOST"] ?? "0.0.0.0",
});
