import { deunionize } from "telegraf";
import {
  userSessionGetByChatId,
  userSessionSetChatState,
  messageMetaGetByChatId,
  sampleGroupsGetByUserId,
  userSessionGetByTgUserId,
  sampleGroupGet,
  type ChatStateType,
  type MessageMetaTypes,
  type ChatStatePayload,
  type MessageMeta,
  textFeedbackCreate,
  messageMetaDelete,
} from "@checkyourstaff/persistence";
import { initializeSession } from "@checkyourstaff/common/initializeSession";
import {
  logger,
  createBot,
  requestPinCode,
  handleEnterPin,
  launchBot,
  requestInitFreeFormFeedback,
  requestEnterFreeFormFeedback,
  requestSelectSampleGroupIdForFreeFormFeedback,
} from "./lib";

const token = process.env["BOT_TOKEN"];

if (!token) {
  logger.fatal("BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

const bot = createBot(token);

bot.start(async (ctx) => {
  const userSession = await initializeSession({
    type: "polling",
    tgChatId: ctx.chat.id,
    tgUserId: ctx.from.id,
    username: ctx.message.from.username,
    firstName: ctx.message.from.first_name,
    lastName: ctx.message.from.last_name,
    languageCode: ctx.message.from.language_code,
  });

  await requestPinCode(ctx.telegram, ctx.chat.id, userSession.id);
});

const freeFormFeedbackCallbackQueryRegexp = /\/fff\?t=(\d+)(?:\&sg=(\d+))?/;

bot.inlineQuery(freeFormFeedbackCallbackQueryRegexp, async (ctx) => {
  const m = ctx.inlineQuery.query.match(freeFormFeedbackCallbackQueryRegexp);

  if (!m) {
    return;
  }

  const type = m[1] as "0" | "1";
  const sampleGroupIdStr = m[2] as string | "choose" | undefined;

  switch (type) {
    case "0" /* Sample group feedback */: {
      const userSession = await userSessionGetByTgUserId(
        "polling",
        ctx.inlineQuery.from.id,
      );

      if (!userSession) {
        logger.error(
          "Can't find user session by tg user id = %s",
          ctx.inlineQuery.from.id,
        );

        return;
      }

      if (sampleGroupIdStr == null) {
        // Then, type must be 1

        logger.error(
          "Free form feedback callback query's type not match with sampleGroupId = undefined",
        );

        return;
      } else if (sampleGroupIdStr === "choose") {
        await requestSelectSampleGroupIdForFreeFormFeedback(
          ctx.telegram,
          ctx.inlineQuery.from.id, // TODO: Only applicable for private chats
          userSession.userId,
        );
      } else if (!Number.isNaN(parseInt(sampleGroupIdStr))) {
        const sampleGroupId = Number(sampleGroupIdStr);
        const sampleGroup = await sampleGroupGet(sampleGroupId);

        if (!sampleGroup) {
          logger.error(
            "Sample group with id = %s not found or deleted",
            sampleGroupId,
          );

          return;
        }

        await requestEnterFreeFormFeedback(ctx.telegram, {
          tgChatId: userSession.tgChatId,
          userId: userSession.userId,
          accountId: sampleGroup.accountId,
          sampleGroupId: sampleGroup.id,
          userSessionId: userSession.id,
        });
      }

      break;
    }
    case "1" /* Developer's feedback */: {
      // TODO: To implement
      break;
    }
  }
});

bot.on("message", async (ctx, next) => {
  const userSession = await userSessionGetByChatId("polling", ctx.chat.id);
  const replyToMessageId = deunionize(ctx.message).reply_to_message?.message_id;
  const text = deunionize(ctx.message).text?.trim();

  if (!userSession) {
    logger.error("User session for chat id = %s not found", ctx.chat.id);

    return next();
  }

  if (!text) {
    logger.error("Message with id = %s has no text", ctx.message.message_id);

    return next();
  }

  const handleInput = async (
    action: ChatStateType | MessageMetaTypes,
    payload: MessageMeta | ChatStatePayload,
  ) => {
    switch (action) {
      case "noop": {
        // Do nothing

        return false; // Don't move to init
      }
      case "init": {
        logger.info("Message received in init state: text = %s", text);

        const sampleGroups = await sampleGroupsGetByUserId(userSession.userId);

        if (sampleGroups.length === 1) {
          await requestInitFreeFormFeedback(
            ctx.telegram,
            ctx.chat.id,
            sampleGroups[0].id,
          );
        } else {
          await requestInitFreeFormFeedback(
            ctx.telegram,
            ctx.chat.id,
            "choose",
          );
        }

        await userSessionSetChatState(userSession.id, "noop");

        return false; // Don't move to init
      }
      case "enter-free-form-feedback": {
        await textFeedbackCreate({
          userId: payload.userId,
          accountId: payload.accountId,
          sampleGroupId: payload.sampleGroupId,
          text,
        });

        return true; // Move to init
      }
      case "enter-pin": {
        logger.info("Enter-pin action invoked");

        await handleEnterPin(
          ctx.telegram,
          ctx.chat.id,
          userSession.userId,
          text,
          userSession.id,
        );

        return true; // Move to init
      }
    }
  };

  if (replyToMessageId) {
    const originMessageMeta = await messageMetaGetByChatId(
      ctx.chat.id,
      replyToMessageId,
    );

    if (!originMessageMeta) {
      logger.error(
        "Origin message meta for message %s not found",
        replyToMessageId,
      );

      return next();
    }

    const result = await handleInput(originMessageMeta.type, originMessageMeta);

    if (result != null && result) {
      await messageMetaDelete(originMessageMeta.id);
    }
  } else {
    const result = await handleInput(
      userSession.chatState.name,
      userSession.chatState.payload,
    );

    if (result != null && result) {
      await userSessionSetChatState(userSession.id, "init");
    }
  }

  return next();
});

launchBot(bot).catch((e) => logger.error(e));
