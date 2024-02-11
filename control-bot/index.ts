import { logger, createBot, createRegisterURL, createInviteURL } from "./lib";
import { Markup } from "telegraf";
import { initializeSession } from "@checkyourstaff/common/initializeSession";
import { keymask } from "@checkyourstaff/common/keymask";
import { userSessionGetByTgChatId } from "@checkyourstaff/persistence";

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


const inviteCommandRegex = /invite_([a-zA-Z0-9]+)/

const inviteGetCommandArg = (command: string) => {
  const m = command.match(inviteCommandRegex)

  if (m) {
    return m[1]
  }
}

bot.command(inviteCommandRegex, async (ctx, next) => {
  const sampleGroupIdMasked = inviteGetCommandArg(ctx.command)!
  const sampleGroupId = Number(keymask.unmask(sampleGroupIdMasked))
  const userSession = await userSessionGetByTgChatId('control', ctx.chat.id)

  if (!userSession) {
    logger.error("User session by chat id = %s not found", ctx.chat.id)

    throw new Error(`User session by chat id = ${ctx.chat.id} not found`)
  }

  const inviteURL = createInviteURL({
    sampleGroupId,
    webappUrl,
    fromBot: 'control-bot',
    userId: userSession.userId,
    chatId: ctx.chat.id
  })

  logger.info('inviteURL = %s', inviteURL.toString())

  await ctx.sendMessage(
    'Пригласите респондентов',
    Markup.inlineKeyboard([
      Markup.button.webApp('Пригласить', inviteURL.toString())
    ])
  )

  return next()
})

bot.launch().catch((e) => logger.error(e));
