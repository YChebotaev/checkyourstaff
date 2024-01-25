import { deunionize } from "telegraf";
import {
  userSessionGetByChatId,
  userSessionSetChatState,
  messageMetaGetByChatId,
  type ChatStateType,
  type MessageMetaTypes,
  type ChatStatePayload,
  type MessageMeta,
} from "@checkyourstaff/persistence";
import {
  logger,
  createBot,
  requestPinCode,
  initializeSession,
  handleEnterPin,
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

bot.on("message", async (ctx, next) => {
  const userSession = await userSessionGetByChatId("polling", ctx.chat.id);
  const replyToMessageId = deunionize(ctx.message).reply_to_message?.message_id;
  const text = deunionize(ctx.message).text?.trim();

  if (!userSession) {
    logger.error("User session for chat id = %s not found", ctx.chat.id);

    return next();
  }

  await userSessionSetChatState(userSession.id, "noop");

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
        logger.info("Message received in noop state: text = %s", text);

        break;
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

        break;
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

    await handleInput(originMessageMeta.type, originMessageMeta);
  } else {
    await handleInput(
      userSession.chatState.name,
      userSession.chatState.payload,
    );
  }

  return next();
});

bot.launch().catch((e) => logger.error(e));
