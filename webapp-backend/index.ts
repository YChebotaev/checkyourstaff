import querystring from "node:querystring";
import { createHmac } from "node:crypto";
import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { Telegram } from "telegraf";
import { Queue } from "bullmq";
import {
  accountCreate,
  accountAdministratorCreate,
  sampleGroupCreate,
  pollCreate,
  pollQuestionCreate,
  inviteCreate,
} from "@checkyourstaff/persistence";
import { logger } from "@checkyourstaff/persistence/logger";
import { parseContactsList } from "@checkyourstaff/common";
import type { VerifyBody, CompleteRegistrationBody } from "./types";

const service = fastify();
const telegram = new Telegram(process.env["BOT_TOKEN"]!);
const spinInvitesQueue = new Queue("spin-invites");

service.register(fastifyCors, { origin: true });

service.post<{
  Body: VerifyBody;
}>("/verify", {
  schema: {
    body: {
      type: "object",
      required: ["initData"],
      properties: {
        initData: { type: "string" },
      },
    },
  },
  async handler({ body: { initData } }) {
    const parsedInitData = querystring.parse(initData) as {
      query_id: string;
      user: string;
      auth_date: string;
      hash: string;
    };
    const secretKey = createHmac("sha256", "WebAppData")
      .update(process.env["BOT_TOKEN"]!)
      .digest();
    const dataCheckString = Object.entries(parsedInitData)
      .filter(([key]) => key !== "hash")
      .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");
    const hash = createHmac("sha256", secretKey)
      .update(dataCheckString)
      .digest("hex");
    const valid = hash === parsedInitData.hash;

    if (!valid) {
      logger.warn("Init data invalid!");
    }

    return { valid };
  },
});

service.post<{
  Body: CompleteRegistrationBody;
}>("/completeRegistration", {
  schema: {
    body: {
      type: "object",
      required: ["name", "groupName", "list", "chatId", "userId"],
      properties: {
        name: { type: "string" },
        groupName: { type: "string" },
        list: { type: "string" },
        chatId: { type: "string" },
        userId: { type: "string" },
      },
    },
  },
  async handler({
    body: { name, groupName, list, chatId: chatIdStr, userId: userIdStr },
  }) {
    const chatId = Number(chatIdStr);
    const userId = Number(userIdStr);

    // Create account
    const accountId = await accountCreate({ name });

    // Create account administrator
    await accountAdministratorCreate({
      accountId,
      userId,
    });

    // Create sample group
    const sampleGroupId = await sampleGroupCreate({
      accountId,
      name: groupName,
    });

    // Create poll from template
    const pollId = await pollCreate({
      accountId,
      name: "Статус сотрудников",
    });

    await pollQuestionCreate({
      accountId,
      pollId,
      text: "Оцените результаты на работе от 1 до 5",
    });

    await pollQuestionCreate({
      accountId,
      pollId,
      text: "Оцените нагрузку на работе от 1 до 5",
    });

    await pollQuestionCreate({
      accountId,
      pollId,
      text: "Оцените счастье на работе от 1 до 5",
    });

    // Invite recepients
    await spinInvitesQueue.addBulk(
      (
        await Promise.all(
          parseContactsList(list).map(({ type, value }) =>
            inviteCreate({
              sampleGroupId,
              email: type === "email" ? value : null,
              phone: type === "phone" ? value : null,
            }),
          ),
        )
      ).map((inviteId) => ({
        name: "send-invite",
        data: { inviteId },
        opts: {
          attempts: 3,
          backoff: {
            type: "exponential",
            delay: 3000,
          },
        },
      })),
    );

    await telegram.sendMessage(chatId, "Приглашения разосланы");
  },
});

service.listen(
  {
    port: Number(process.env["PORT"] ?? 3003),
    host: process.env["HOST"] ?? "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      logger.fatal(err);

      return process.exit(1);
    }

    logger.info("Webapp backend listening at %s", address);
  },
);
