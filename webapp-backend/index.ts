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
} from "./types";
import {
  pollAnswerCreate,
  pollQuestionsGetByPollId,
  pollSessionGet,
  textFeedbackCreate,
} from "@checkyourstaff/persistence";

const service = fastify({ logger });
const telegram = new Telegram(process.env["BOT_TOKEN"]!);

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

    await telegram.sendMessage(
      chatId,
      `
      Аккаунт «${accountName}» создан
    `.trim(),
    );
    await telegram.sendMessage(
      chatId,
      `
      Вы стали администратором аккаунта «${accountName}»
    `.trim(),
    );
    await telegram.sendMessage(
      chatId,
      `
      Опрос «Статус сотрудников» создан
    `.trim(),
    );
    await telegram.sendMessage(
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
  Querystring: {
    pollSessionId: string;
  };
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
    query: { pollSessionId: pollSessionIdStr },
  }) {
    console.log({ finalFeedback, answers });

    const pollSessionId = Number(pollSessionIdStr);

    for (const answer of answers) {
      await pollAnswerCreate({
        pollSessionId,
        pollQuestionId: answer.id,
        score: answer.score,
      });

      if (answer.textFeedback) {
        await textFeedbackCreate({
          pollSessionId,
          pollQuestionId: answer.id,
          text: answer.textFeedback,
        });
      }
    }

    if (finalFeedback) {
      await textFeedbackCreate({
        pollSessionId,
        text: finalFeedback,
      });
    }
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
