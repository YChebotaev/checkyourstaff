import { UnrecoverableError, Worker } from "bullmq";
import { logger, sendInvite } from "./lib";

export const spinInvitesWorker = new Worker<
  {
    inviteId: number;
  },
  void,
  "send-invite"
>(
  "spin-invites",
  (job) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "send-invite":
        return sendInvite(job.data.inviteId);
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
