import { deunionize } from "telegraf";
import {
  userSessionGetByTgChatId,
  userSessionSetChatState,
  messageMetaGetByChatId,
  sampleGroupsGetByUserId,
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
  handleFreeFormFeedbackCallbackQuery,
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

{
  const freeFormFeedbackCallbackQueryRegexp = /\/fff\?t=(\d+)(?:\&sg=(\d+))?/;

  const getFreeFormFeedbackCallbackParams = (data?: string) => {
    if (!data) {
      return
    }

    const m = data.match(freeFormFeedbackCallbackQueryRegexp)

    if (!m) {
      return
    }

    const type = m[1] as '0' | '1'
    const sampleGroupIdStr = m[2] as string | 'choose' | undefined
    const sampleGroupId = sampleGroupIdStr === 'choose'
      ? ('choose' as const)
      : (
        sampleGroupIdStr
          ? Number(sampleGroupIdStr)
          : undefined
      )

    return {
      type,
      sampleGroupId
    }
  }

  bot.on("callback_query", async (ctx) => {
    const params = getFreeFormFeedbackCallbackParams(
      deunionize(ctx.callbackQuery).data
    )

    if (!params) {
      logger.warn('Cannot parse free form feedback callback query params')

      return
    }

    await handleFreeFormFeedbackCallbackQuery({
      telegram: ctx.telegram,
      fromId: ctx.callbackQuery.from.id,
      ...params
    })
  });
}

bot.on("message", async (ctx, next) => {
  const userSession = await userSessionGetByTgChatId("polling", ctx.chat.id);
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
