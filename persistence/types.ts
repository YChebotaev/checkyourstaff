export type Account = {
  id: number
  name: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type User = {
  id: number
  name: string | null // Актуально для администраторов
  email: string | null // Актуально для администраторов
  phone: string | null // Актуально для администраторов
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type AccountAdministrator = {
  id: number
  accountId: number
  userId: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type SampleGroup = {
  id: number
  accountId: number
  name: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type Responder = {
  id: number
  sampleGroupId: number
  pollId: number
  userId: number
  phone: string | null // И/или емейл и/или телефон
  email: string | null // И/или емейл и/или телефон
  pin: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type Poll = {
  id: number
  name: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PollQuestion = {
  id: number
  accountId: number
  pollId: number
  text: string
  minScore: number
  maxScore: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PollSession = {
  id: number
  pollId: number
  accountId: number
  sampleGroupId: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PollAnswer = {
  id: number
  pollId: number
  pollQuestionId: number
  accountId: number
  pollSessionId: number
  score: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type TextFeedback = {
  id: number
  pollId: number | null
  pollQuestionId: number | null
  accountId: number | null
  pollSessionId: number | null
  text: string
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PinCodeGenerator = {
  id: number
  size: number // 4
  generatedCout: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type PinCode = {
  id: number
  accountId: number
  sampleGroupId: number
  code: string
  used: boolean
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type MessageMeta = {
  id: number
  messageId: number // Telegram message id
  chatId: number // Telegram chat id
  type: string // To be specified later
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}

export type UserSession = {
  id: number
  userId: number
  chatId: number
  deleted: boolean
  createdAt: Date
  updatedAt: Date
}
