import querystring from "node:querystring";
import { createHmac } from "node:crypto";

const getBotToken = (bot: "control-bot" | "polling-bot") => {
  switch (bot) {
    case "control-bot":
      return process.env["CONTROL_BOT_TOKEN"]!;
    case "polling-bot":
      return process.env["POLLING_BOT_TOKEN"]!;
  }
};

export const verify = ({
  initData,
  bot,
}: {
  initData: string;
  bot: "control-bot" | "polling-bot";
}) => {
  const parsedInitData = querystring.parse(initData) as {
    query_id: string;
    user: string;
    auth_date: string;
    hash: string;
  };
  const botToken = getBotToken(bot);
  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const dataCheckString = Object.entries(parsedInitData)
    .filter(([key]) => key !== "hash")
    .sort(([aKey], [bKey]) => aKey.localeCompare(bKey))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const hash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return hash === parsedInitData.hash;
};
