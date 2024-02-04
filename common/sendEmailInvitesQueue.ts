import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const sendEmailInvitesQueue = new Queue("send-email-invites", {
  connection: redisConnection,
});
