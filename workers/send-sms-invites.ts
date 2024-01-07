import { UnrecoverableError, Worker } from "bullmq";
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
  (job) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "send-sms-invite":
        return sendSMSInvite(job.data.pinCode, job.data.phone);
      default:
        throw new UnrecoverableError("Job.name unknown");
    }
  },
  {
    connection: {
      host: "localhost",
      port: 6379,
    },
  },
);
