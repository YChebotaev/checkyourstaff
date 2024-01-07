import { Queue } from 'bullmq'

export const sendSMSInvitesQueue = new Queue("send-sms-invites");
