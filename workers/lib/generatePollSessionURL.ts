export const createPollSessionURL = ({
  webappUrl,
  fromBot,
  responderId,
  pollSessionId,
}: {
  webappUrl: string;
  fromBot: "polling-bot" | "control-bot";
  responderId: number;
  pollSessionId: number;
}) => {
  const pollSessionURL = new URL("/pollSession", webappUrl);

  pollSessionURL.searchParams.set("fromBot", fromBot);
  pollSessionURL.searchParams.set("responderId", String(responderId));
  pollSessionURL.searchParams.set("pollSessionId", String(pollSessionId));

  return pollSessionURL;
};
