import { Markup } from "telegraf";
import { pollingTelegram } from "@checkyourstaff/common/telegram";
import { logger } from "./logger";

export const notifyPollTelegram = async (
  tgChatId: number,
  pollSessionURL: string,
  text: string,
) => {
  logger.info(
    "Notifying chat id = %s about poll session url = %s",
    tgChatId,
    pollSessionURL,
  );

  await pollingTelegram.sendMessage(
    tgChatId,
    "Пройдите опрос",
    Markup.inlineKeyboard([
      Markup.button.webApp(text, pollSessionURL.toString()),
    ]),
  );
};
