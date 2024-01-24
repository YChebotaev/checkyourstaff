import { UnrecoverableError, Worker } from "bullmq";
import { logger, notifyPollTelegram } from "./lib";

export const notifyPollTelegramWorker = new Worker<
  {
    tgChatId: number;
    pollSessionURL: string;
    text: string;
  },
  void,
  "notify-poll-telegram"
>(
  "notify-poll-telegram",
  (job) => {
    logger.info(
      'Start processing job with name = "%s" and data = %s',
      job.name,
      JSON.stringify(job.data),
    );

    switch (job.name) {
      case "notify-poll-telegram":
        return notifyPollTelegram(
          job.data.tgChatId,
          job.data.pollSessionURL,
          job.data.text,
        );
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
