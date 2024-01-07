import { knex } from './knex'
import { logger } from './logger'
import type { Job, JobTypes } from './types'

export const jobCreate = async ({
  pollId,
  sampleGroupId,
  type,
  cron,
  timeZone,
}: {
  pollId: number
  sampleGroupId: number
  type: JobTypes
  cron: string
  timeZone: string
}) => {
  const [{ id }] = await knex
    .insert({
      pollId,
      sampleGroupId,
      type,
      cron,
      timeZone,
      createdAt: knex.fn.now()
    })
    .into('jobs')
    .returning('id')

  logger.info('Job created with id = %s for sample group id = "%s" and poll id = %s', id, sampleGroupId, pollId)

  return id as number
}

export const jobGet = async (id: number) => {
  const job = await knex
    .select('*')
    .from('jobs')
    .where('id', id)
    .first<Job>()

  if (!job) {
    logger.warn('Job with id = %s not found', id)

    return
  }

  if (job.deleted) {
    logger.warn('Job with jd = %s found but deleted', id)

    return
  }

  return job
}

export const jobsGetAll = async () => {
  return (await knex
    .select<Job[]>('*')
    .from('jobs'))
    .filter(job => job.deleted === false || job.deleted == null)
}

export const jobsGetSince = async (since: Date) => {
  // TODO: To implement

  return []
}

export const jobDelete = async (id: number) => {
  await knex('jobs')
    .update({
      deleted: true,
      updatedAt: knex.fn.now()
    })
    .where('id', id)

  logger.info('Job with id = %s deleted', id)
}
