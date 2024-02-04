export const createRegisterURL = ({
  webappUrl,
  fromBot,
  userId,
  chatId,
}: {
  webappUrl: string;
  fromBot: "polling-bot" | "control-bot";
  userId: number;
  chatId: number;
}) => {
  const registerURL = new URL("/register", webappUrl);

  registerURL.searchParams.set("fromBot", fromBot);
  registerURL.searchParams.set("userId", String(userId));
  registerURL.searchParams.set("tgChatId", String(chatId));

  return registerURL;
};
