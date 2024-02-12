import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection";

export const spinInvitesQueue = new Queue("spin-invites", {
  connection: redisConnection,
});

export const sendInviteBulk = (records: { inviteId: number }[]) => {
  return spinInvitesQueue.addBulk(
    records.map(({ inviteId }) => ({
      name: 'send-invite',
      data: { inviteId }
    }))
  );
}
