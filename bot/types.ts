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
  textFeedbacks: SessionTextFeedback[],
  textFeedbacksMessageIds: number[]
}

export type SessionAnswer = {
  id: number
  ts: string
  chatId: number
  question: '1' | '2' | '3'
  score: number
  feedback?: string
  feedbackDeleted?: boolean
}

export type SessionTextFeedback = {
  id: number
  ts: string
  chatId: number
  feedback: string
  deleted?: boolean
}

export type PendingMessage = {
  chatId: number
  username: string
}
