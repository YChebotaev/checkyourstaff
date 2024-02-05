import { Telegram } from "telegraf";
import { createLogger } from "./createLogger";

const logger = createLogger("common");
const pollingBotToken = process.env["POLLING_BOT_TOKEN"];

if (!pollingBotToken) {
  logger.fatal("POLLING_BOT_TOKEN environment variable must be provided");

  process.exit(1);
}

export const pollingTelegram = new Telegram(pollingBotToken);
