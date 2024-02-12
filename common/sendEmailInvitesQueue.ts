import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const sendEmailInvitesQueue = new Queue("send-email-invites", {
  connection: redisConnection,
});

export const sendEmailInvite = ({ pinCode, email }: {
  pinCode: string
  email: string
}) => {
  return sendEmailInvitesQueue.add('send-email-invite', {
    pinCode,
    email
  })
}
