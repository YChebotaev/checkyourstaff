import { without, first } from 'lodash'
import { knex } from './knex'
import { logger } from './logger'
import type { PollSession, PollingState } from './types'

export const pollSessionCreate = async ({
  pollId,
  accountId,
  sampleGroupId,
  pollingState
}: {
  pollId: number
  accountId: number
  sampleGroupId: number
  pollingState: PollingState
}) => {
  const [{ id }] = await knex
    .insert({
      pollId,
      accountId,
      sampleGroupId,
      pollingState: JSON.stringify(pollingState),
      createdAt: knex.fn.now()
    })
    .into('pollSessions')
    .returning('id')

  logger.info(
    'Poll session created with id = %s for sample group id = %s and poll id = %s',
    id,
    sampleGroupId,
    pollId
  )

  return id as number
}

export const pollSessionUpdatePollingState = async (id: number, updater: (pollingState: PollingState) => PollingState) => {
  const { pollingState } = await knex
    .select('pollingState')
    .from('pollSessions')
    .where('id', id)
    .first<Pick<PollSession, 'pollingState'>>()

  await knex('pollSessions')
    .update({
      pollingState: JSON.stringify(
        updater(
          JSON.parse(String(pollingState))
        )
      )
    })
    .where('id', id)
}

export const pollSessionGet = async (id: number) => {
  const pollSession = await knex
    .select('*')
    .from('pollSessions')
    .where('id', id)
    .first<PollSession>()

  if (!pollSession) {
    logger.warn('Poll session with id = %s not found', id)

    return
  }

  if (pollSession.deleted) {
    logger.warn("Poll session with id = %s was found but deleted", id)

    return
  }

  return {
    ...pollSession,
    pollingState: JSON.parse(String(pollSession.pollingState))
  } as PollSession
}
