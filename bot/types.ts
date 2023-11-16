export type Session = {
  id: number
  ts: string
  tz: string
  answeredChatIds: number[]
  answers: SessionAnswer[]
  questionsMessagesIds: {
    [key in '1' | '2' | '3']: number | null
  }
  feedbackMessageIds: {
    [key in '1' | '2' | '3']: number | null
  }
}

export type SessionAnswer = {
  id: number
  ts: string
  chatId: number
  question: '1' | '2' | '3'
  score: number
  feedback?: string
}
