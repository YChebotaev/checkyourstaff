import { DelayedError, UnrecoverableError, Worker } from "bullmq";
import { addHours } from "date-fns";
import { redisConnection } from "@checkyourstaff/common/redisConnection";
import { logger, sendSMSInvite } from "./lib";

export const sendSMSInviteWorker = new Worker<
  {
    pinCode: string;
    phone: string;
  },
  void,
  "send-sms-invite"
>(
  "send-sms-invites",
  async (job, token) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "send-sms-invite":
        try {
          return sendSMSInvite(job.data.pinCode, job.data.phone);
        } catch (e) {
          if (e instanceof DelayedError) {
            const timestamp = addHours(new Date(), 2).getTime();

            await job.moveToDelayed(timestamp, token);

            return;
          }

          throw e;
        }
      default:
        throw new UnrecoverableError("Job.name unknown");
    }
  },
  {
    connection: redisConnection,
  },
);
