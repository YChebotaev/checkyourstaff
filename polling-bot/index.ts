import { logger, createBot } from "./lib";

const token = process.env["BOT_TOKEN"];

if (!token) {
  logger.fatal("BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

const bot = createBot(token);

bot.launch().catch((e) => logger.error(e));
