import { type Telegram, Markup } from "telegraf";
import { sampleGroupsGetByUserId } from "@checkyourstaff/persistence";

export const requestSelectSampleGroupIdForFreeFormFeedback = async (
  telegram: Telegram,
  chatId: number,
  userId: number,
) => {
  const sampleGroups = await sampleGroupsGetByUserId(userId);

  await telegram.sendMessage(
    chatId,
    "Выберите группу, для которой хотите оставить фидбек",
    Markup.inlineKeyboard([
      ...sampleGroups.map((sampleGroup) =>
        Markup.button.callback(
          sampleGroup.name,
          `/fff?t=0&sg=${sampleGroup.id}`,
        ),
      ),
    ]),
  );
};
