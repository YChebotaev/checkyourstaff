import { type Telegram } from "telegraf";
import { userSessionSetChatState } from "@checkyourstaff/persistence";
import { joinByPin } from "./joinByPin";
import { logger } from "./logger";

export const handleEnterPin = async (
  telegram: Telegram,
  tgChatId: number,
  userId: number,
  code: string,
  userSessionId: number,
) => {
  let resetChatState = true

  try {
    const joinResult = await joinByPin({
      code,
      userId,
    });

    if (joinResult) {
      if (joinResult === "already-joined") {
        await telegram.sendMessage(
          tgChatId,
          "Вы уже присоединились к этой группе. Повторное присоединение невозможно",
        );
      } else if (joinResult === 'wrong-pin-code') {
        resetChatState = false

        await telegram.sendMessage(tgChatId, 'Пин-код не верный. Попробуйте еще раз')

        await userSessionSetChatState(userSessionId, 'enter-pin')
      } else {
        await telegram.sendMessage(
          tgChatId,
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
    if (resetChatState) {
      await userSessionSetChatState(userSessionId, "init");
    }
  }
};
