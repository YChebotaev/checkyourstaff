import { UnrecoverableError, Worker } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";
import { logger, sendEmailInvite } from "./lib";

export const sendEmailInviteWorker = new Worker<
  {
    pinCode: string
    email: string;
  }, void,
  "send-email-invite"
>(
  "send-email-invites",
  (job) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "send-email-invite":
        return sendEmailInvite(job.data.pinCode, job.data.email);
      default:
        throw new UnrecoverableError("Job.name unknown");
    }
  },
  {
    connection: redisConnection,
  },
);
