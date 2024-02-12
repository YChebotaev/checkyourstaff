import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

export const sendSMSInvitesQueue = new Queue("send-sms-invites", {
  connection: redisConnection,
});

export const sendSmsInvite = ({ pinCode, phone }: {
  pinCode: string
  phone: string
}) => {
  return sendSMSInvitesQueue.add('send-sms-invite', {
    pinCode,
    phone
  }, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 65000
    }
  })
}
