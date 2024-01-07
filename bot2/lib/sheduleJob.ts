import cron from 'node-cron'
import { type Telegraf } from 'telegraf'
import { startPollSession } from './startPollSession'
import { type Job } from '@checkyourstaff/persistence'
import { logger } from './logger'

export const sheduleJob = (bot: Telegraf, job: Job) => {
  cron.schedule(
    job.cron,
    () => {
      switch (job.type) {
        case 'poll-session':
          void startPollSession(bot, job.pollId, job.sampleGroupId)
            .then(e => logger.error(e))
          break
      }
    },
    { timezone: job.timeZone }
  )
}
