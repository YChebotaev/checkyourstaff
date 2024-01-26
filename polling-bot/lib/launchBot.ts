import { createServer } from "node:http";
import { type Telegraf } from "telegraf";

export const launchBot = async (bot: Telegraf) => {
  const botHost = process.env["BOT_HOST"];
  const port = Number(process.env["PORT"] ?? 3005);

  if (botHost) {
    const hook = await bot.createWebhook({ domain: botHost });
    const server = createServer(hook);

    return new Promise<void>((resolve) => {
      server.listen(port, botHost, () => {
        resolve();
      });
    });
  } else {
    return bot.launch();
  }
};
