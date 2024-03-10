import type { BotType } from "@checkyourstaff/webapp-backend/types";

export const getBotType = () => {
  const url = new URL(window.location.href);

  return url.searchParams.get("fromBot") as BotType
};
