import { knex } from './knex'
import { logger } from './logger'
import type { MessageMeta, MessageMetaTypes } from './types'

export const messageMetaCreate = async ({
  messageId,
  tgChatId,
  type,
  accountId = null,
  sampleGroupId = null,
  pollQuestionId = null,
  pollSessionId = null,
  responderId = null,
  pollId = null
}: {
  messageId: number
  tgChatId: number
  type: MessageMetaTypes
  accountId?: number | null
  sampleGroupId?: number | null
  pollQuestionId?: number | null
  pollSessionId?: number | null
  responderId?: number | null
  pollId?: number | null
}) => {
  const [{ id }] = await knex
    .insert({
      messageId,
      tgChatId,
      type,
      accountId,
      sampleGroupId,
      pollId,
      pollQuestionId,
      pollSessionId,
      responderId,
      createdAt: new Date().getTime()
    })
    .into('messageMetas')
    .returning('id')

  logger.info('Message meta created with id = %s and type = "%s"', id, type)

  return id as number
}

export const messageMetaGetByChatId = async (tgChatId: number, messageId: number) => {
  const messageMeta = await knex
    .select('*')
    .from('messageMetas')
    .where({
      tgChatId,
      messageId
    })
    .first<MessageMeta>()

  if (messageMeta.deleted) {
    logger.warn("Message meta with id = %s was found but deleted", messageMeta.id)

    return
  }

  return messageMeta
}

export const messageMetaDelete = async (id: number) => {
  await knex('messageMetas')
    .update({
      deleted: true,
      updatedAt: new Date().getTime()
    })
    .where('id', id)

  logger.info('Message meta with id = %s deleted', id)
}
