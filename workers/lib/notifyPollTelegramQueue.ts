import { Queue } from 'bullmq'

export const notifyPollTelegramQueue = new Queue("notify-poll-telegram");
