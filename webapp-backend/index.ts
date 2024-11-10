import { fastify } from "fastify";
import fastifyCors from "@fastify/cors";
import { Telegram } from "telegraf";
import plural from "plural-ru";
import { parseContactsList } from "@checkyourstaff/common/parseContactsList";
import { normalizeTelegramMessage } from '@checkyourstaff/common/normalizeTelegramMessage'
import { keymask } from '@checkyourstaff/common/keymask'
import { logger, completeRegistration, verify, inviteRecepients } from "./lib";
import type {
  VerifyBody,
  CompleteRegistrationBody,
  ClosePollSessionBody,
  ClosePollSessionQuery,
} from "./types";
import {
  accountGetByName,
  invitesGetByContacts,
  pollAnswerCreate,
  pollQuestionsGetByPollId,
  pollSessionGet,
  responderDelete,
  respondersGetByInviteId,
  sampleGroupGet,
  sampleGroupGetByNameAndAccountId,
  textFeedbackCreate,
  userSessionGetByTgUserId,
} from "@checkyourstaff/persistence";

const app = fastify({ logger });
const controlBotTelegram = new Telegram(process.env["CONTROL_BOT_TOKEN"]!);
const pollingBotTelegram = new Telegram(process.env["POLLING_BOT_TOKEN"]!);

app.register(fastifyCors, { origin: true });

app.post<{
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

app.post<{
  Body: CompleteRegistrationBody;
}>("/completeRegistration", {
  schema: {
    body: {
      type: "object",
      required: ["name", "groupName", "list", "tgChatId", "userId"],
      properties: {
        name: { type: "string" },
        groupName: { type: "string" },
        list: { type: "string" },
        tgChatId: { type: "string" },
        userId: { type: "string" },
      },
    },
  },
  async handler({
    body: {
      name: accountName,
      groupName,
      list,
      tgChatId: tgChatIdStr,
      userId: userIdStr,
    },
  }) {
    const tgChatId = Number(tgChatIdStr);
    const userId = Number(userIdStr);
    const contacts = parseContactsList(list);

    const { sampleGroupId } = await completeRegistration({
      accountName,
      groupName,
      contacts,
      userId,
    });

    await controlBotTelegram.sendMessage(
      tgChatId,
      `
      Аккаунт «${accountName}» создан
    `.trim(),
    );
    await controlBotTelegram.sendMessage(
      tgChatId,
      `
      Вы стали администратором аккаунта «${accountName}»
    `.trim(),
    );
    {
      const sampleGroup = await sampleGroupGet(sampleGroupId)

      if (!sampleGroup) {
        logger.error('Sample group by id = %s not found or deleted', sampleGroupId)

        throw new Error(`Sample group by id = ${sampleGroupId} not found or deleted`)
      }

      await controlBotTelegram.sendMessage(
        tgChatId,
        normalizeTelegramMessage(`
          Группа «${groupName}» создана

          /invite_${keymask.mask(sampleGroupId)} — пригласить участников в группу «${sampleGroup.name}»
          /kick_${keymask.mask(sampleGroupId)} — удалить участников из группы «${sampleGroup.name}»
        `)
      )
    }

    await controlBotTelegram.sendMessage(
      tgChatId,
      `
      Опрос «Статус сотрудников» создан
    `.trim(),
    );
    await controlBotTelegram.sendMessage(
      tgChatId,
      `${plural(
        contacts.length,
        "%d приглашение",
        "%d приглашения",
        "%d приглашений",
      )} разослано`,
    );
  },
});

app.get<{
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

app.post<{
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
    querystring: {
      type: 'object',
      required: ['pollSessionId', 'tgUserId'],
      properties: {
        pollSessionId: { type: 'string' },
        tgUserId: { type: 'string' }
      }
    }
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
        accountId: pollSession.accountId,
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
      userSession.tgChatId,
      "Спасибо, ваши данные успешно сохранены. Ожидайте следующий опрос в следующую пятницу",
    );
  },
});

app.post<{
  Body: {
    sampleGroupId: number
    list: string
    tgChatId: number
  }
}>('/inviteMembers', {
  schema: {
    body: {
      type: 'object',
      required: ['sampleGroupId', 'list', 'tgChatId'],
      properties: {
        sampleGroupId: { type: 'number' },
        list: { type: 'string' },
        tgChatId: { type: 'number' }
      }
    }
  }
}, async ({ body: { sampleGroupId, list, tgChatId } }) => {
  const contacts = parseContactsList(list)

  if (contacts.length <= 0) {
    throw new Error('Contacts in list must be more than 0')
  }

  await inviteRecepients({
    contacts,
    sampleGroupId
  })

  {
    const sampleGroup = await sampleGroupGet(sampleGroupId)

    if (!sampleGroup) {
      logger.error('Sample group by id = %s not found or deleted', sampleGroupId)

      throw new Error(`Sample group by id = ${sampleGroupId} not found or deleted`)
    }

    await controlBotTelegram.sendMessage(
      tgChatId,
      normalizeTelegramMessage(`
      ${plural(
        contacts.length,
        "%d приглашение",
        "%d приглашения",
        "%d приглашений",
      )} разослано
    `)
    )
  }
})

app.post<{
  Body: {
    sampleGroupId: number
    list: string
    tgChatId: number
  }
}>('/kickMembers', {
  schema: {
    body: {
      type: 'object',
      required: ['sampleGroupId', 'list', 'tgChatId'],
      properties: {
        sampleGroupId: { type: 'number' },
        list: { type: 'string' },
        tgChatId: { type: 'number' }
      }
    }
  }
}, async ({ body: { sampleGroupId, list, tgChatId } }) => {
  const contacts = parseContactsList(list)
    .flatMap(contacts => contacts.map(({ value }) => value))

  if (contacts.length <= 0) {
    throw new Error('Contacts in list must be more than 0')
  }

  {
    const invites = await invitesGetByContacts(contacts)

    for (const { id } of invites) {
      const responders = await respondersGetByInviteId(id)

      for (const { id } of responders) {
        await responderDelete(id)
      }
    }
  }

  {
    const sampleGroup = await sampleGroupGet(sampleGroupId)

    if (!sampleGroup) {
      logger.error('Sample group by id = %s not found or deleted', sampleGroupId)

      throw new Error(`Sample group by id = ${sampleGroupId} not found or deleted`)
    }

    await controlBotTelegram.sendMessage(
      tgChatId,
      normalizeTelegramMessage(`
      ${plural(
        contacts.length,
        "%d участников",
        "%d участников",
        "%d участников",
      )} удалено
    `)
    )
  }
})

app.get<{
  Params: {
    sampleGroupId: string
  }
}>('/sampleGroups/:sampleGroupId', async ({
  params: { sampleGroupId: sampleGroupIdStr }
}) => {
  const sampleGroupId = Number(sampleGroupIdStr)

  return sampleGroupGet(sampleGroupId)
})

app.get<{
  Querystring: {
    name: string
  }
}>('/accounts', {
  schema: {
    querystring: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' }
      }
    }
  }
}, async ({ query: { name } }) => {
  const account = await accountGetByName(name)

  return account ? [account] : []
})

app.get<{
  Querystring: {
    name: string
    accountId: string
  }
}>('/sampleGroups', {
  schema: {
    querystring: {
      type: 'object',
      required: ['name', 'accountId'],
      properties: {
        name: { type: 'string' },
        accountId: { type: 'string' }
      }
    }
  }
}, async ({ query: { name, accountId: accountIdStr } }) => {
  const accountId = Number(accountIdStr)
  const sampleGroup = await sampleGroupGetByNameAndAccountId(name, accountId)

  return sampleGroup ? [sampleGroup] : []
})

app.listen({
  port: Number(process.env["PORT"] ?? 3003),
  host: process.env["HOST"] ?? "0.0.0.0",
});
