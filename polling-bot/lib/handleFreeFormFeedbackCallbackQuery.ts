import { type Telegram } from 'telegraf'
import { userSessionGetByTgUserId, sampleGroupGet } from "@checkyourstaff/persistence";
import { logger } from "./logger";
import { requestEnterFreeFormFeedback } from "./requestEnterFreeFormFeedback";
import { requestSelectSampleGroupIdForFreeFormFeedback } from "./requestSelectSampleGroupIdForFreeFormFeedback";

export const handleFreeFormFeedbackCallbackQuery = async ({
  telegram,
  fromId,
  type,
  sampleGroupId,
}: {
  telegram: Telegram,
  fromId: number,
  type: '0' | '1'
  sampleGroupId: number | 'choose' | undefined
}) => {
  switch (type) {
    case "0" /* Sample group feedback */: {
      const userSession = await userSessionGetByTgUserId(
        "polling",
        fromId,
      );

      if (!userSession) {
        logger.error(
          "Can't find user session by tg user id = %s",
          fromId,
        );

        return;
      }

      if (sampleGroupId == null) {
        // Then, type must be 1

        logger.error(
          "Free form feedback callback query's type not match with sampleGroupId = undefined",
        );

        return;
      } else if (sampleGroupId === "choose") {
        await requestSelectSampleGroupIdForFreeFormFeedback(
          telegram,
          fromId, // TODO: Only applicable for private chats
          userSession.userId,
        );
      } else if (sampleGroupId) {
        const sampleGroup = await sampleGroupGet(sampleGroupId);

        if (!sampleGroup) {
          logger.error(
            "Sample group with id = %s not found or deleted",
            sampleGroupId,
          );

          return;
        }

        await requestEnterFreeFormFeedback(telegram, {
          tgChatId: userSession.tgChatId,
          userId: userSession.userId,
          accountId: sampleGroup.accountId,
          sampleGroupId: sampleGroup.id,
          userSessionId: userSession.id,
        });
      }

      break;
    }
    case "1" /* Developer's feedback */: {
      // TODO: To implement
      break;
    }
  }
}
