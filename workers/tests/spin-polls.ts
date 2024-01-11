import { Queue } from "bullmq";

const spinPollsQueue = new Queue("spin-polls");

spinPollsQueue
  .add("spin-poll", {
    pollId: 2,
    sampleGroupId: 2,
  })
  .then(() => {
    process.exit(1);
  });
