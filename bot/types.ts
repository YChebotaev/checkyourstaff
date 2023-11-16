export type Session = {
  id: number
  ts: string
  tz: string
  answeredChatIds: number[]
  answers: SessionAnswer[]
}

export type SessionAnswer = {
  ts: string
  chatId: number
  question: '1' | '2' | '3'
  score: number
}
