import { type Queue } from 'bullmq'
import { spinPollsQueue } from '@checkyourstaff/common/spinPollsQueue'
import { spinInvitesQueue } from '@checkyourstaff/common/spinInvitesQueue'
import { sendSMSInvitesQueue } from '@checkyourstaff/common/sendSMSInvitesQueue'
import { sendEmailInvitesQueue } from '@checkyourstaff/common/sendEmailInvitesQueue'

const deleteRepeatableJobs = async (queue: Queue) => {
  const repeatableJobs = await queue.getRepeatableJobs()

  for (const job of repeatableJobs) {
    await queue.removeRepeatableByKey(job.key)
  }
}

Promise.all([
  spinPollsQueue.drain(true),
  spinInvitesQueue.drain(true),
  sendSMSInvitesQueue.drain(true),
  sendEmailInvitesQueue.drain(true)
]).then(() => {
  return Promise.all([
    spinPollsQueue.clean(0, Infinity),
    spinInvitesQueue.clean(0, Infinity),
    sendSMSInvitesQueue.clean(0, Infinity),
    sendEmailInvitesQueue.clean(0, Infinity)
  ])
}).then(() => {
  return Promise.all([
    deleteRepeatableJobs(spinPollsQueue),
    deleteRepeatableJobs(spinInvitesQueue),
    deleteRepeatableJobs(sendSMSInvitesQueue),
    deleteRepeatableJobs(sendEmailInvitesQueue)
  ])
})
