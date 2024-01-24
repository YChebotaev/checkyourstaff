import {
  userSessionGetByChatId,
  userCreate,
  userSessionCreate,
  userSessionGet,
} from "@checkyourstaff/persistence";

export const initializeSession = async ({
  type,
  chatId,
  tgUserId,
  username,
  firstName,
  lastName,
  languageCode,
}: {
  type: "polling" | "control";
  chatId: number;
  tgUserId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
}) => {
  let userSession = await userSessionGetByChatId(chatId);

  if (!userSession) {
    const userId = await userCreate({
      username,
      firstName,
      lastName,
      languageCode,
    });

    const userSessionId = await userSessionCreate({
      type,
      userId,
      chatId,
      tgUserId,
    });

    userSession = await userSessionGet(userSessionId);
  }

  return userSession!;
};
