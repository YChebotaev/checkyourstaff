import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const notifyPollTelegramQueue = new Queue("notify-poll-telegram", {
  connection: redisConnection,
});
