import { type Telegram, Markup } from "telegraf";
import {
  messageMetaCreate,
  userSessionSetChatState,
} from "@checkyourstaff/persistence";

export const requestEnterFreeFormFeedback = async (
  telegram: Telegram,
  {
    tgChatId,
    userId,
    accountId,
    sampleGroupId,
    userSessionId,
  }: {
    tgChatId: number;
    userId: number;
    accountId: number;
    sampleGroupId: number;
    userSessionId: number;
  },
) => {
  const { message_id } = await telegram.sendMessage(
    tgChatId,
    "Теперь введите непосредственно сам фидбек:",
    Markup.forceReply(),
  );

  await messageMetaCreate({
    messageId: message_id,
    type: "enter-free-form-feedback",
    tgChatId,
    userId,
    accountId,
    sampleGroupId,
    userSessionId,
  });

  await userSessionSetChatState(userSessionId, "enter-free-form-feedback", {
    userId,
    accountId,
    sampleGroupId,
  });
};
