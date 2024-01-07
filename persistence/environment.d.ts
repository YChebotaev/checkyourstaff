import type {
  Account,
  User,
  AccountAdministrator,
  SampleGroup,
  Responder,
  Poll,
  PollQuestion,
  PollSession,
  PollAnswer,
  TextFeedback,
  PinCodeGenerator,
  PinCode,
  MessageMeta,
  UserSession
} from './types'

declare module 'knex/types/tables' {
  interface Tables {
    accounts: Account
    users: User
    accountAdministrators: AccountAdministrator
    sampleGroups: SampleGroup
    responders: Responder
    polls: Poll
    pollQuestions: PollQuestion
    pollSessions: PollSession
    pollAnswers: PollAnswer
    textFeedbacks: TextFeedback
    pinCodeGenerators: PinCodeGenerator
    pinCodes: PinCode
    messageMetas: MessageMeta
    userSessions: UserSession
  }
}

export {}
