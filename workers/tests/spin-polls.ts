import { Queue } from "bullmq";

const spinPollsQueue = new Queue("spin-polls");

spinPollsQueue
  .add("spin-poll", {
    pollId: 1,
    sampleGroupId: 1,
  })
  .then(() => {
    process.exit(1);
  });
