import {
  userSessionGetByTgChatId,
  userCreate,
  userSessionCreate,
  userSessionGet,
} from "@checkyourstaff/persistence";

export const initializeSession = async ({
  type,
  tgChatId,
  tgUserId,
  username,
  firstName,
  lastName,
  languageCode,
}: {
  type: "polling" | "control";
  tgChatId: number;
  tgUserId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
}) => {
  let userSession = await userSessionGetByTgChatId(type, tgChatId);

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
      tgChatId,
      tgUserId,
    });

    userSession = await userSessionGet(userSessionId);
  }

  return userSession!;
};
