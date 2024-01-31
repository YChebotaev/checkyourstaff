import { Queue } from "bullmq";
import { redisConnection } from "@checkyourstaff/common/redisConnection";

const spinPollsQueue = new Queue("spin-polls", { connection: redisConnection });

spinPollsQueue
  .add("spin-poll", {
    pollId: 1,
    sampleGroupId: 1,
  })
  .then(() => {
    process.exit(1);
  });
