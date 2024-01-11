import url from "node:url";
import { Markup, deunionize } from "telegraf";
import {
  accountAdministratorCreate,
  accountCreate,
  accountIsExists,
  messageMetaGetByChatId,
  messageMetaCreate,
  sampleGroupCreate,
  sampleGroupGet,
  sampleGroupIsExists,
  userCreate,
  userSessionCreate,
  userSessionGetByChatId,
  inviteCreate,
  messageMetaDelete,
  pollCreate,
  pollGet,
  sampleGroupsGetByAccountId,
  pollQuestionCreate,
  jobsGetAll,
  textFeedbackCreate,
  pollSessionUpdatePollingState,
  pollAnswerCreate,
  pollsGetByAccountId,
  jobCreate,
  jobGet,
} from "@checkyourstaff/persistence";
import { parsePhoneNumber, isValidPhoneNumber } from "libphonenumber-js/mobile";
import { without } from "lodash";
import {
  logger,
  generatePinCode,
  createBot,
  joinByPin,
  sendCloseMessage,
  sendNextQuestion,
  sheduleJob,
  startPollSession,
} from "./lib";
import { PinCodePayload } from "./types";

const token = process.env["BOT_TOKEN"];

if (!token) {
  logger.fatal("BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

const bot = createBot(token);

bot.start(async (ctx, next) => {
  const userSession = await userSessionGetByChatId(ctx.chat.id);

  if (!userSession) {
    const userId = await userCreate();

    await userSessionCreate({ userId, chatId: ctx.chat.id });
  }

  const { message_id } = await ctx.sendMessage(
    "Введите пин-код",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    type: "enter-pin",
  });

  await next();
});

bot.command("register", async (ctx, next) => {
  const userSession = await userSessionGetByChatId(ctx.chat.id);

  if (!userSession) {
    return next();
  }

  await ctx.reply(
    "Пройдите шаги по регистрации",
    Markup.inlineKeyboard([
      Markup.button.webApp(
        "Пройти регистрацию",
        `${process.env["WEBAPP_URL"]!}/register?userId=${
          userSession.userId
        }&chatId=${ctx.chat.id}`,
      ),
    ]),
  );

  await next();
});

bot.command("join", async (ctx, next) => {
  const userSession = await userSessionGetByChatId(ctx.chat.id);

  if (!userSession) {
    logger.warn(
      "User session by chat id = %s not found or deleted",
      ctx.chat.id,
    );

    return;
  }

  await joinByPin({
    code: ctx.args[0],
    userId: userSession.userId,
    async sendMessage(text) {
      await ctx.reply(text);
    },
  });

  logger.info("User joined by pin = %s", ctx.args[0]);

  await next();
});

bot.command("account_create", async (ctx, next) => {
  const { message_id } = await ctx.reply(
    "Введите название аккаунта (обычно это название компании)",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    type: "enter-account-name",
  });

  await next();
});

const groupCreateCommandRegexp = /group_create_(\d+)/;

bot.command(groupCreateCommandRegexp, async (ctx, next) => {
  const [_, strAccountId] = ctx.command.match(groupCreateCommandRegexp) ?? [];

  if (!strAccountId) {
    logger.warn(
      "Command %s was matched but accountId was not matched",
      ctx.command,
    );

    return next();
  }

  const accountId = Number(strAccountId);

  if (!accountId) {
    logger.warn(
      'Command %s was matched but accountId = "%s" was not parsed',
      ctx.command,
      strAccountId,
    );

    return next();
  }

  const accountExists = await accountIsExists(accountId);

  if (!accountExists) {
    await ctx.reply("Такого аккаунта нет, или он удален");

    return next();
  }

  const { message_id } = await ctx.reply(
    "Теперь введите название группы:",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    accountId,
    type: "enter-group-name",
  });

  await next();
});

const groupInviteCommandRegexp = /group_invite_(\d+)/;

bot.command(groupInviteCommandRegexp, async (ctx, next) => {
  const [_, strSessionGroupId] =
    ctx.command.match(groupInviteCommandRegexp) ?? [];

  if (!strSessionGroupId) {
    logger.warn(
      "Command %s was matched but groupId was not matched",
      ctx.command,
    );

    return next();
  }

  const sampleGroupId = Number(strSessionGroupId);

  if (!sampleGroupId) {
    logger.warn(
      'Command %s was matched but accountId = "%s" was not parsed',
      ctx.command,
      strSessionGroupId,
    );

    return next();
  }

  const sampleGroupExists = await sampleGroupIsExists(sampleGroupId);

  if (!sampleGroupExists) {
    logger.warn(
      "Group with id = %s not found while processing command = %s",
      sampleGroupId,
      ctx.command,
    );

    await ctx.reply("Такой группы нет, или она удалена");

    return next();
  }

  const sampleGroup = await sampleGroupGet(sampleGroupId);

  if (!sampleGroup) {
    logger.warn("Sample group with id = %s not found", sampleGroupId);

    return next();
  }

  const { message_id } = await ctx.reply(
    "Теперь введите номер телефона или емейл кого вы хотите пригласить в группу:",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    type: "invite-user",
    accountId: sampleGroup.accountId,
    sampleGroupId,
  });

  await next();
});

const pollCreateCommandRegexp = /poll_create_(\d+)/;

bot.command(pollCreateCommandRegexp, async (ctx, next) => {
  const [_, strAccountId] = ctx.command.match(pollCreateCommandRegexp) ?? [];

  if (!strAccountId) {
    logger.warn(
      "Command %s was matched but accountId was not matched",
      ctx.command,
    );

    return next();
  }

  const accountId = Number(strAccountId);

  if (!accountId) {
    logger.warn(
      'Command %s was matched but accountId = "%s" was not parsed',
      ctx.command,
      strAccountId,
    );

    return next();
  }

  const { message_id } = await ctx.reply(
    "Введите название опроса:",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    accountId,
    type: "enter-questionary-name",
  });

  await next();
});

const questionCreateCommandRegexp = /question_create_(\d+)/;

bot.command(questionCreateCommandRegexp, async (ctx, next) => {
  const [_, strPollId] = ctx.command.match(questionCreateCommandRegexp) ?? [];

  if (!strPollId) {
    logger.warn(
      "Command %s was matched but pollId was not matched",
      ctx.command,
    );

    return next();
  }

  const pollId = Number(strPollId);

  if (!pollId) {
    logger.warn(
      'Command %s was matched but pollId = "%s" was not parsed',
      ctx.command,
      strPollId,
    );

    return next();
  }

  const poll = await pollGet(pollId);

  if (!poll) {
    logger.warn("Poll with id = %s not found or deleted", pollId);

    await ctx.reply("Опрос не найден");

    return next();
  }

  const { message_id } = await ctx.reply(
    "Введите текст вопроса:",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    type: "enter-question-text",
    pollId,
    accountId: poll.accountId,
  });

  await next();
});

const sheduleSession = async (
  accountId: number,
  sampleGroupId: number,
  pollId: number,
) => {
  const jobId = await jobCreate({
    pollId,
    sampleGroupId,
    type: "poll-session",
    cron: "0 17 * * FRI",
    timeZone: "Europe/Moscow",
  });

  const job = await jobGet(jobId);

  if (!job) {
    logger.warn("Job with id = %s not found or deleted", jobId);

    return;
  }

  sheduleJob(bot, job);
};

const sheduleSessionCommandRegexp =
  /shedule_session_(\d+)(?:_(x|\d+))(?:_(\d+))?/;

bot.command(sheduleSessionCommandRegexp, async (ctx, next) => {
  const [_, strAccountId, strMaybeSampleGroupId, strMaybePollId] =
    ctx.command.match(sheduleSessionCommandRegexp) ?? [];

  const accountId = Number(strAccountId);
  const sampleGroupId: number | null =
    strMaybeSampleGroupId === "x" ? null : Number(strMaybeSampleGroupId);
  const pollId: number | null = strMaybePollId ? Number(strMaybePollId) : null;

  if (sampleGroupId && pollId) {
    await sheduleSession(accountId, sampleGroupId, pollId);
  } else if (!sampleGroupId && pollId) {
    const sampleGroups = await sampleGroupsGetByAccountId(accountId);

    if (sampleGroups.length === 0) {
      await ctx.reply("Прежде, чем начинать опрос, создайте группу");

      return next();
    }

    await ctx.reply(
      "Выберите группу для начала опроса:",
      Markup.inlineKeyboard([
        ...sampleGroups.map((sampleGroup) => [
          Markup.button.callback(
            sampleGroup.name,
            `/shedule_session_${accountId}_${sampleGroup.id}_${pollId}`,
          ),
        ]),
      ]),
    );
  } else if (sampleGroupId && !pollId) {
    const polls = await pollsGetByAccountId(accountId);

    if (polls.length === 0) {
      await ctx.reply(`У вас на аккаунте нет опросов
          
Создать опрос: /poll_create_${accountId}`);

      return next();
    }

    await ctx.reply(
      "Выберите опрос для начала:",
      Markup.inlineKeyboard([
        ...polls.map((poll) =>
          Markup.button.callback(
            poll.name,
            `/shedule_session_${accountId}_${sampleGroupId}_${poll.id}`,
          ),
        ),
      ]),
    );
  } else if (!sampleGroupId && !pollId) {
    // TODO: To implement
  }

  await next();
});

bot.action(/shedule_session_(\d+)_(\d+)_(\d+)/, async (ctx, next) => {
  const [_, strAccountId, strSampleGroupId, strPollId] = ctx.match;

  const accountId = Number(strAccountId);
  const sampleGroupId = Number(strSampleGroupId);
  const pollId = Number(strPollId);

  await sheduleSession(accountId, sampleGroupId, pollId);

  await ctx.answerCbQuery("Опрос успешно запланирован");

  await next;
});

/**
 * Handle response
 */
bot.on("message", async (ctx, next) => {
  const replyToMessageId = deunionize(ctx.message).reply_to_message?.message_id;

  if (!replyToMessageId) {
    return next();
  }

  const originMessageMeta = await messageMetaGetByChatId(
    ctx.chat.id,
    replyToMessageId,
  );

  if (!originMessageMeta) {
    return next();
  }

  await messageMetaDelete(originMessageMeta?.id);

  const text = deunionize(ctx.message).text?.trim();
  const userSession = await userSessionGetByChatId(ctx.chat.id);
  const { type } = originMessageMeta;

  if (!text || !userSession) {
    return next();
  }

  switch (type) {
    case "enter-pin": {
      await joinByPin({
        code: text,
        userId: userSession.userId,
      });

      break;
    }
    case "enter-account-name": {
      const accountId = await accountCreate({ name: text });

      await accountAdministratorCreate({
        accountId,
        userId: userSession.userId,
      });

      await ctx.reply(`Аккаунт "${text}" успешно создан.
Теперь вам доступно несколько возможностей:

Создать группу респондентов на данном аккаунте: /group_create_${accountId}

Создать опрос на данном аккаунте: /poll_create_${accountId}

Запланировать опрос на данном аккаунте: /shedule_session_${accountId}
`);

      break;
    }
    case "enter-group-name": {
      const { accountId } = originMessageMeta;

      if (!accountId) {
        logger.warn("Error happens with originMessageMeta.accountId");

        return next();
      }

      const sampleGroupId = await sampleGroupCreate({ accountId, name: text });

      await ctx.reply(`Группа "${text}" успешно создана.

Теперь вам доступно несколько возможностей:

Пригласить пользователя в группу: /group_invite_${sampleGroupId}

Запланировать опрос на эту группу: /shedule_session_${accountId}_${sampleGroupId}
          `);

      break;
    }
    case "invite-user": {
      const { sampleGroupId } = originMessageMeta;

      if (!sampleGroupId) {
        logger.warn("Error happens with originMessageMeta.sampleGroupId");

        return next();
      }

      const isMaybeEmail = text.includes("@");
      const isMaybePhone = isValidPhoneNumber(text, "RU");
      let email: string | null = null;
      let phone: string | null = null;

      if (isMaybeEmail) {
        email = text;
      } else if (isMaybePhone) {
        phone = parsePhoneNumber(text, "RU").formatInternational();
      }

      if (email || phone) {
        const inviteId = await inviteCreate({
          sampleGroupId,
          phone,
          email,
        });

        await generatePinCode<PinCodePayload>({
          type: "invite-responder",
          inviteId,
        });
      } else {
        await ctx.reply("Нужно ввести емейл или телефон. Попробуйте еще раз");
      }

      if (!email && phone) {
        await ctx.reply(`Приглашение отправлено по SMS на номер ${phone}

Пригласить еще одного респондента: /group_invite_${sampleGroupId}
`);
      } else if (email && !phone) {
        await ctx.reply(`Приглашение отправлено по емейлу ${email}

Пригласить еще одного респондента: /group_invite_${sampleGroupId}
`);
      }

      break;
    }
    case "enter-questionary-name": {
      const pollId = await pollCreate({
        accountId: originMessageMeta.accountId!,
        name: text,
      });

      await ctx.reply(`Опрос "${text}" успешно создан!

Добавить вопрос в опрос: /question_create_${pollId}

Запланировать опрос на будущее: /shedule_session_${originMessageMeta.accountId!}_x_${pollId}
`);

      break;
    }
    case "enter-question-text": {
      await pollQuestionCreate({
        accountId: originMessageMeta.accountId!,
        pollId: originMessageMeta.pollId!,
        text,
      });

      const poll = await pollGet(originMessageMeta.pollId!);

      if (!poll) {
        logger.warn(
          "Poll with id = %s not found or deleted",
          originMessageMeta.pollId,
        );

        return next();
      }

      await ctx.reply(`Новый вопрос в опрос "${poll.name}" успешно добавлен.

Добавить еще один вопрос: /question_create_${poll.id}
`);

      break;
    }
    case "enter-text-feedback": {
      await textFeedbackCreate({
        pollQuestionId: originMessageMeta.pollQuestionId!,
        pollSessionId: originMessageMeta.pollSessionId!,
        text,
      });

      await ctx.reply("Ваш фидбек не пропадет!");

      void sendNextQuestion(
        bot,
        originMessageMeta.pollSessionId!,
        originMessageMeta.responderId!,
      ).catch((e) => logger.error(e));

      break;
    }
    case "enter-final-feedback": {
      await textFeedbackCreate({
        pollSessionId: originMessageMeta.pollSessionId,
        text,
      });

      await ctx.sendMessage("Ваш фидбек не пропадет!");

      void sendCloseMessage(bot, originMessageMeta.responderId!).catch((e) =>
        logger.error(e),
      );

      break;
    }
  }

  await next();
});

/**
 * Debug
 */
bot.command("start_poll_session", async (ctx, next) => {
  const [pollId, sampleGroupId] = ctx.args.map(Number);

  if (!pollId && !sampleGroupId) {
    return next();
  }

  void startPollSession(bot, pollId, sampleGroupId).catch((e) =>
    logger.error(e),
  );

  await next();
});

bot.on("callback_query", async (ctx, next) => {
  const data = deunionize(ctx.callbackQuery).data;

  if (!data) {
    return next();
  }

  const parsedUrl = url.parse(data, true);

  if (parsedUrl.pathname === "/sf") {
    const {
      ri: strResponderId,
      psi: strPollSessionId,
      pqi: strPollQuestionId,
      s: strScore,
      rtf: strRequestTextFeedback,
    } = parsedUrl.query;
    const responderId = Number(strResponderId);
    const pollSessionId = Number(strPollSessionId);
    const pollQuestionId = Number(strPollQuestionId);
    const score = Number(strScore);
    const requestTextFeedback = strRequestTextFeedback === "1";

    await pollAnswerCreate({
      pollSessionId,
      pollQuestionId,
      score,
    });

    await pollSessionUpdatePollingState(pollSessionId, (pollingState) => {
      return {
        ...pollingState,
        [responderId]: without(pollingState[responderId], pollQuestionId),
      };
    });

    await ctx.answerCbQuery("Спасибо, данные учтены");

    if (requestTextFeedback) {
      const { message_id } = await ctx.reply(
        "Поделитесь что случилось в ответом комментарии",
        Markup.forceReply(),
      );

      await messageMetaCreate({
        messageId: message_id,
        chatId: ctx.chat!.id,
        type: "enter-text-feedback",
        pollSessionId,
        pollQuestionId,
        responderId,
      });
    } else {
      void sendNextQuestion(bot, pollSessionId, responderId).catch((e) =>
        logger.error(e),
      );
    }
  }

  await next();
});

jobsGetAll()
  .then((jobs) => jobs.forEach((job) => sheduleJob(bot, job)))
  .catch((e) => logger.error(e));

bot.launch();
