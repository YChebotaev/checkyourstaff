import { type Telegram } from "telegraf";
import { userSessionSetChatState } from "@checkyourstaff/persistence";
import { joinByPin } from "./joinByPin";
import { logger } from "./logger";

export const handleEnterPin = async (
  telegram: Telegram,
  chatId: number,
  userId: number,
  code: string,
  userSessionId: number,
) => {
  try {
    const joinResult = await joinByPin({
      code,
      userId,
    });

    if (joinResult) {
      if (joinResult === "already-joined") {
        await telegram.sendMessage(
          chatId,
          "Вы уже присоединились к этой группе. Повторное присоединение невозможно",
        );
      } else {
        await telegram.sendMessage(
          chatId,
          "Вы успешно присоединились к группе. Скоро к вам придут вопросы по поводу вашей работы",
        );
      }
    } else {
      logger.warn(
        'By some reason user id = %s cannot join by pin = "%s"',
        userId,
        code,
      );
    }
  } catch (e) {
    logger.error(e);
  } finally {
    await userSessionSetChatState(userSessionId, "noop");
  }
};
