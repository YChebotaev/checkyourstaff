import type {
  ChatMetadata,
  PollSession,
  PollAnswer,
  PollFeedback,
  MessageMetadata
} from './types'

declare module 'knex/types/tables' {
  interface Tables {
    chatMetadata: ChatMetadata
    pollSession: PollSession
    pollAnswer: PollAnswer
    pollFeedback: PollFeedback
    messageMetadata: MessageMetadata
  }
}
