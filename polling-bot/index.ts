import { Markup, deunionize } from "telegraf";
import {
  userSessionGetByChatId,
  userCreate,
  userSessionCreate,
  messageMetaCreate,
  userSessionSetChatState,
  userSessionGet,
  messageMetaGetByChatId,
  type ChatStateType,
  type MessageMetaTypes,
  type ChatStatePayload,
  type MessageMeta,
} from "@checkyourstaff/persistence";
import { logger, createBot } from "./lib";
import { joinByPin } from "./lib";

const token = process.env["BOT_TOKEN"];

if (!token) {
  logger.fatal("BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

const bot = createBot(token);

bot.start(async (ctx, next) => {
  let userSession = await userSessionGetByChatId(ctx.chat.id);

  if (!userSession) {
    const userId = await userCreate();

    const userSessionId = await userSessionCreate({
      type: "polling",
      userId,
      chatId: ctx.chat.id,
      tgUserId: ctx.message.from.id,
    });

    userSession = await userSessionGet(userSessionId);
  }

  // Enter pin-code

  const { message_id } = await ctx.sendMessage(
    "Введите пин-код",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId: ctx.chat.id,
    type: "enter-pin",
  });

  await userSessionSetChatState(userSession!.id, "enter-pin");

  return next();
});

bot.on("message", async (ctx, next) => {
  const userSession = await userSessionGetByChatId(ctx.chat.id);
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
    const handleEnterPin = async () => {
      /**
       * @TODO
       * Если в списке контактов указать одновременно и номер
       * и емейл одного и того же сотрудника, ему будут
       * выписаны два инвайта с разными пин-кодами
       *
       * Таким образом, сотрудник может
       * присоединиться к одной группе дважды
       *
       * Этот кейс нужно обработать и при попытке заинвайтиться
       * одному юзеру в одну группу, выдавать сообщение,
       * что он уже присоединен, и не создавать еще одного
       * респондента
       */

      try {
        if (
          await joinByPin({
            code: text,
            userId: userSession.userId,
          })
        ) {
          await ctx.sendMessage(
            "Вы успешно присоединились к группе. Скоро к вам придут вопросы по поводу вашей работы",
          );
        }
      } catch (e) {
        logger.error(e);
      } finally {
        await userSessionSetChatState(userSession.id, "noop");
      }
    };

    switch (action) {
      case "noop": {
        logger.info("Message received in noop state: text = %s", text);

        break;
      }
      case "enter-pin": {
        logger.info("Enter-pin action invoked");

        await handleEnterPin();

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
