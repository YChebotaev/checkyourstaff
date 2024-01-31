import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const spinInvitesQueue = new Queue("spin-invites", {
  connection: redisConnection,
});
