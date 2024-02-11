import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection";

export const spinInvitesQueue = new Queue("spin-invites", {
  connection: redisConnection,
});
