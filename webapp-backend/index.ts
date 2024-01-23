import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { Telegram } from "telegraf";
import plural from "plural-ru";
import { parseContactsList } from "@checkyourstaff/common/parseContactsList";
import { logger, completeRegistration, verify } from "./lib";
import type {
  VerifyBody,
  CompleteRegistrationBody,
  ClosePollSessionBody,
  ClosePollSessionQuery,
} from "./types";
import {
  pollAnswerCreate,
  pollQuestionsGetByPollId,
  pollSessionGet,
  textFeedbackCreate,
  userSessionGetByTgUserId,
} from "@checkyourstaff/persistence";

const service = fastify({ logger });
const controlBotTelegram = new Telegram(process.env["CONTROL_BOT_TOKEN"]!);
const pollingBotTelegram = new Telegram(process.env["POLLING_BOT_TOKEN"]!);

service.register(fastifyCors, { origin: true });

service.post<{
  Body: VerifyBody;
}>("/verify", {
  schema: {
    body: {
      type: "object",
      required: ["initData", "bot"],
      properties: {
        initData: { type: "string" },
        bot: {
          enum: ["polling-bot", "control-bot"],
        },
      },
    },
  },
  async handler({ body: { initData, bot } }) {    
    const valid = verify({ initData, bot });

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
    body: {
      name: accountName,
      groupName,
      list,
      chatId: chatIdStr,
      userId: userIdStr,
    },
  }) {
    const chatId = Number(chatIdStr);
    const userId = Number(userIdStr);
    const contacts = parseContactsList(list);

    await completeRegistration({
      accountName,
      groupName,
      contacts,
      userId,
    });

    await controlBotTelegram.sendMessage(
      chatId,
      `
      Аккаунт «${accountName}» создан
    `.trim(),
    );
    await controlBotTelegram.sendMessage(
      chatId,
      `
      Вы стали администратором аккаунта «${accountName}»
    `.trim(),
    );
    await controlBotTelegram.sendMessage(
      chatId,
      `
      Опрос «Статус сотрудников» создан
    `.trim(),
    );
    await controlBotTelegram.sendMessage(
      chatId,
      `${plural(
        contacts.length,
        "%d приглашение",
        "%d приглашения",
        "%d приглашений",
      )} разослано`,
    );
  },
});

service.get<{
  Querystring: {
    pollSessionId: string;
  };
}>("/pollSession", async ({ query: { pollSessionId: pollSessionIdStr } }) => {
  const pollSessionId = Number(pollSessionIdStr);
  const pollSession = await pollSessionGet(pollSessionId);

  if (!pollSession) {
    logger.error(
      "Poll session with id = %s not found or deleted",
      pollSessionId,
    );

    throw new Error(
      `Poll session with id = ${pollSessionId} not found or deleted`,
    );
  }

  const pollQuestions = await pollQuestionsGetByPollId(pollSession.pollId);

  return pollQuestions.map(
    ({ id, text, minScore, maxScore, textFeedbackRequestTreshold }) => ({
      id,
      text,
      minScore,
      maxScore,
      textFeedbackRequestTreshold,
    }),
  );
});

service.post<{
  Body: ClosePollSessionBody;
  Querystring: ClosePollSessionQuery;
}>("/closePollSession", {
  schema: {
    body: {
      type: "object",
      required: ["answers"],
      properties: {
        finalFeedback: { type: "string" },
        answers: {
          type: "array",
          items: {
            type: "object",
            required: ["id", "score"],
            properties: {
              id: { type: "number" },
              score: { type: "number" },
              textFeedback: { type: "string" },
            },
          },
        },
      },
    },
  },
  async handler({
    body: { finalFeedback, answers },
    query: { pollSessionId: pollSessionIdStr, tgUserId: tgUserIdStr },
  }) {
    const pollSessionId = Number(pollSessionIdStr);
    const pollSession = await pollSessionGet(pollSessionId);
    const tgUserId = Number(tgUserIdStr);
    const userSession = await userSessionGetByTgUserId("polling", tgUserId);

    if (!userSession) {
      logger.info(
        "User session by tg user id = %s not found or deleted",
        tgUserId,
      );

      return;
    }

    if (!pollSession) {
      logger.info(
        "Poll session by id = %s not found or deleted",
        pollSessionId,
      );

      return;
    }

    for (const answer of answers) {
      await pollAnswerCreate({
        userId: userSession.userId,
        pollSessionId,
        pollQuestionId: answer.id,
        sampleGroupId: pollSession.sampleGroupId,
        score: answer.score,
      });

      if (answer.textFeedback) {
        await textFeedbackCreate({
          accountId: pollSession.accountId,
          sampleGroupId: pollSession.sampleGroupId,
          userId: userSession.userId,
          pollId: pollSession.pollId,
          pollSessionId,
          pollQuestionId: answer.id,
          text: answer.textFeedback,
        });
      }
    }

    if (finalFeedback) {
      await textFeedbackCreate({
        accountId: pollSession.accountId,
        sampleGroupId: pollSession.sampleGroupId,
        userId: userSession.userId,
        pollId: pollSession.pollId,
        pollSessionId,
        text: finalFeedback,
      });
    }

    await pollingBotTelegram.sendMessage(
      userSession.chatId,
      "Спасибо, ваши данные успешно сохранены. Ожидайте следующий опрос в следующую пятницу",
    );
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
