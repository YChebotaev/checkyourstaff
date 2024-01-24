import {
  userSessionGetByChatId,
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
  console.group("initializeSession");

  console.log({
    type,
    tgChatId,
    tgUserId,
    username,
    firstName,
    lastName,
    languageCode,
  });

  let userSession = await userSessionGetByChatId("polling", tgChatId);

  console.log("userSession =", userSession);

  if (!userSession) {
    const userId = await userCreate({
      username,
      firstName,
      lastName,
      languageCode,
    });

    console.log("userId =", userId);

    const userSessionId = await userSessionCreate({
      type,
      userId,
      tgChatId,
      tgUserId,
    });

    console.log("userSessionId =", userSessionId);

    userSession = await userSessionGet(userSessionId);
  }

  console.log("userSession =", userSession);

  console.groupEnd();

  return userSession!;
};
