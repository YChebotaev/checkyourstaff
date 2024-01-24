import { Markup, type Telegram } from "telegraf";
import {
  messageMetaCreate,
  userSessionSetChatState,
} from "@checkyourstaff/persistence";

export const requestPinCode = async (
  telegram: Telegram,
  chatId: number,
  userSessionId: number,
) => {
  const { message_id } = await telegram.sendMessage(
    chatId,
    "Введите пин-код",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    chatId,
    type: "enter-pin",
  });

  await userSessionSetChatState(userSessionId, "enter-pin");
};
