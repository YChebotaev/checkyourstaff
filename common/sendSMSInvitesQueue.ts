import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const sendSMSInvitesQueue = new Queue("send-sms-invites", {
  connection: redisConnection,
});
