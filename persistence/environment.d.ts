import type {
  ChatMetadata,
  PollSession,
  PollAnswer,
  PollFeedback,
  MessageMetadata,
  Account,
  Session,
  Poll,
  PollMember
} from './types'

declare module 'knex/types/tables' {
  interface Tables {
    chatMetadata: ChatMetadata
    pollSession: PollSession
    pollAnswer: PollAnswer
    pollFeedback: PollFeedback
    messageMetadata: MessageMetadata
    account: Account
    session: Session
    poll: Poll
    pollMember: PollMember
  }
}
