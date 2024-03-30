import { pollingTelegram } from "@checkyourstaff/common/telegram";
import {
  textFeedbackGet,
  userSessionGetByUserId,
} from "@checkyourstaff/persistence";

export const sendMessageToTextFeedback = async ({
  textFeedbackId,
  role,
  username,
}: {
  textFeedbackId: number;
  role: string;
  username: string;
}) => {
  const textFeedback = await textFeedbackGet(textFeedbackId);

  if (!textFeedback) {
    throw new Error(
      `Text feedback with id = ${textFeedbackId} not found or deleted`,
    );
  }

  const userSession = await userSessionGetByUserId(textFeedback.userId);

  if (!userSession) {
    throw new Error(
      `User session with user id = ${textFeedback.userId} not found or deleted`,
    );
  }

  await pollingTelegram.sendMessage(
    userSession.tgChatId,
    `${role} прочитал ваш анонимный отзыв и хочет подробнее изучить ситуацию и обсудить её с вами. Если вам важно обсудить это, то вы можете лично написать в телеграм @${username}. Если хотите остаться анонимным, то просто проигнорируйте это сообщение`,
  );
};
