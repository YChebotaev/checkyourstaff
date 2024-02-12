export const createKickURL = ({
  sampleGroupId,
  webappUrl,
  fromBot,
  userId,
  chatId
}: {
  sampleGroupId: number
  webappUrl: string;
  fromBot: "polling-bot" | "control-bot";
  userId: number;
  chatId: number;
}) => {
  const inviteURL = new URL("/kick", webappUrl);

  inviteURL.searchParams.set("fromBot", fromBot);
  inviteURL.searchParams.set("userId", String(userId));
  inviteURL.searchParams.set("tgChatId", String(chatId));
  inviteURL.searchParams.set('sampleGroupId', String(sampleGroupId))

  return inviteURL;
}
