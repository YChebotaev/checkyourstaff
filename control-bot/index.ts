import { logger, createBot, createRegisterURL } from "./lib";
import { Markup } from "telegraf";
import { initializeSession } from "@checkyourstaff/common/initializeSession";

const token = process.env["BOT_TOKEN"];
const webappUrl = process.env["WEBAPP_URL"];

if (!token) {
  logger.fatal("BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

if (!webappUrl) {
  logger.fatal("WEBAPP_URL environment variable must be provided");

  process.exit(1);
}

const bot = createBot(token);

bot.start(async (ctx, next) => {
  let userSession = await initializeSession({
    type: "control",
    tgChatId: ctx.chat.id,
    tgUserId: ctx.from.id,
    username: ctx.message.from.username,
    firstName: ctx.message.from.first_name,
    lastName: ctx.message.from.last_name,
    languageCode: ctx.message.from.language_code,
  });

  const registerURL = createRegisterURL({
    webappUrl,
    fromBot: "control-bot",
    userId: userSession.userId,
    chatId: ctx.chat.id,
  });

  logger.info("registerURL = %s", registerURL.toString());

  await ctx.sendMessage(
    "Пройдите регистрацию",
    Markup.inlineKeyboard([
      Markup.button.webApp("Регистрация", registerURL.toString()),
    ]),
  );

  return next();
});

bot.launch().catch((e) => logger.error(e));
