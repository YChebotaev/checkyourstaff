import { UnrecoverableError, Worker } from "bullmq";
import { logger, spinPoll } from "./lib";

export const spinPollsWorker = new Worker<
  {
    pollId: number;
    sampleGroupId: number;
  },
  void,
  "spin-poll"
>(
  "spin-polls",
  (job) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "spin-poll":
        return spinPoll(job.data.pollId, job.data.sampleGroupId);
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
