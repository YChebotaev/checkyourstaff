import { Telegram } from "telegraf";

export const pollingTelegram = new Telegram(process.env["POLLING_BOT_TOKEN"]!);
