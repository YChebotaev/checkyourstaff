import {
  userCreate,
  userSessionCreate,
  userSessionGet,
  userSessionGetByChatId,
} from "@checkyourstaff/persistence";
import { logger, createBot } from "./lib";
import { Markup } from "telegraf";

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
  let userSession = await userSessionGetByChatId(ctx.chat.id);

  if (!userSession) {
    const userId = await userCreate();

    const userSessionId = await userSessionCreate({
      userId,
      chatId: ctx.chat.id,
    });

    userSession = await userSessionGet(userSessionId);
  }

  const registerURL = new URL("/register", webappUrl);

  registerURL.searchParams.set("fromBot", "control-bot");
  registerURL.searchParams.set("userId", String(userSession!.userId));
  registerURL.searchParams.set("chatId", String(ctx.chat.id));

  await ctx.sendMessage(
    "Пройдите регистрацию",
    Markup.inlineKeyboard([
      Markup.button.webApp("Регистрация", registerURL.toString()),
    ]),
  );

  return next();
});

bot.launch().catch((e) => logger.error(e));
