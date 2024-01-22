import { Queue } from "bullmq";

const spinPollsQueue = new Queue("spin-polls");

spinPollsQueue
  .add(
    "dummy-spin-poll",
    {
      pollId: 2,
      sampleGroupId: 2,
    },
    {
      jobId: 'second',
      repeat: {
        pattern: "* * * * *",
      },
    },
  )
  .then(() => {
    process.exit(1);
  });
