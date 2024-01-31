import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

const spinPollsQueue = new Queue("spin-polls", { connection: redisConnection });

spinPollsQueue
  .add(
    "dummy-spin-poll",
    {
      pollId: 2,
      sampleGroupId: 2,
    },
    {
      jobId: "second",
      repeat: {
        pattern: "* * * * *",
      },
    },
  )
  .then(() => {
    process.exit(1);
  });
