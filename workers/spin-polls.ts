import { UnrecoverableError, Worker } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";
import { logger, spinPoll } from "./lib";

export const spinPollsWorker = new Worker<
  {
    pollId: number;
    sampleGroupId: number;
  },
  void,
  "spin-poll" | "dummy-spin-poll"
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
      case "dummy-spin-poll":
        logger.info("Process dummy-spin-poll job");

        return Promise.resolve();
      default:
        throw new UnrecoverableError("Job.name unknown");
    }
  },
  {
    connection: redisConnection,
  },
);
