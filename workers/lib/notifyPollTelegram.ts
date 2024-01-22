import { Markup } from "telegraf";
import { pollingTelegram } from "@checkyourstaff/common/telegram";
import { logger } from "./logger";

export const notifyPollTelegram = async (
  chatId: number,
  pollSessionURL: string,
  text: string,
) => {
  logger.info(
    "Notifying chat id = %s about poll session url = %s",
    chatId,
    pollSessionURL,
  );

  await pollingTelegram.sendMessage(
    chatId,
    "Пройдите опрос",
    Markup.inlineKeyboard([
      Markup.button.webApp(text, pollSessionURL.toString()),
    ]),
  );
};
