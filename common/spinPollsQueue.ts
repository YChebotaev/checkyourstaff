import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection";

export const spinPollsQueue = new Queue("spin-polls", {
  connection: redisConnection,
});
