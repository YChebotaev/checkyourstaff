import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const spinPollsQueue = new Queue("spin-polls", {
  connection: redisConnection,
});
