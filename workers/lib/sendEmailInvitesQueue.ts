import { Queue } from 'bullmq'

export const sendEmailInvitesQueue = new Queue("send-email-invites");
