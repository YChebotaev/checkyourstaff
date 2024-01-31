import { type Telegram, Markup } from "telegraf";

export const requestInitFreeFormFeedback = async (
  telegram: Telegram,
  tgChatId: number,
  sampleGroupId: number | "choose",
) => {
  await telegram.sendMessage(
    tgChatId,
    "Вы хотите оставить фидбек о работе чата, или сообщить сведения руководству?",
    Markup.inlineKeyboard([
      Markup.button.callback(
        "Сообщить сведения руководству",
        `/fff?t=0&sg=${sampleGroupId}`,
      ),
      Markup.button.callback("Оставить фидбек о работе чата", `/fff?t=1`),
    ]),
  );
};
