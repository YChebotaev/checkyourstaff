// @ts-nocheck

import { fastify } from "fastify"
import fastifyCors from '@fastify/cors'
import pino from 'pino'
import JSONDB from 'simple-json-db'
import { groupBy, last, keys, union, identity } from 'lodash'
import type { FreeFormFeedback, Session } from '@checkyourstaff/bot/types'
import type { ChartDataResp, TextFeedbackResp, StatsResp } from "./types"

const calculateAveragesOfSession = (session: Session) => {
  const answersByQuestion = groupBy(session.answers, 'question')
  const sumScoresByQuestion: { [key: string]: number } = {}
  const avgScoresByQuestion: { [key: string]: number } = {}

  for (const answers of Object.values(answersByQuestion)) {
    for (const answer of answers) {
      if (sumScoresByQuestion[answer.question] != null) {
        sumScoresByQuestion[answer.question] += answer.score
      } else {
        sumScoresByQuestion[answer.question] = answer.score
      }
    }
  }

  for (const [question, sum] of Object.entries(sumScoresByQuestion)) {
    const count = answersByQuestion[question].length

    avgScoresByQuestion[question] = sum / count
  }

  return avgScoresByQuestion
}

const calculateDifferenceOfAverages = (a1: { [key: number]: number }, a2: { [key: number]: number }) => {
  const ks = union(keys(a1), keys(a2))
  const result: { [key: number]: number } = {}

  for (const key of ks) {
    const a1v = a1[key]
    const a2v = a2[key]

    result[key] = Math.round((a1v / a2v - 1) * 100)
  }

  return result
}

const logger = pino()
const service = fastify({ logger })

service.register(fastifyCors, {
  origin: true
})

service.get<{ Result: StatsResp }>('/stats', () => {
  const db = new JSONDB(process.env['DB_FILE']!)
  const sessions: Session[] = db.get('sessions') ?? []

  sessions.sort((a, b) => {
    const timeA = new Date(a.ts).getTime()
    const timeB = new Date(b.ts).getTime()

    return timeA - timeB
  })

  const lastSession = last(sessions)

  if (lastSession) {
    const prevSession = sessions[sessions.length - 2]
    const lastSessionAverages = calculateAveragesOfSession(lastSession)

    if (prevSession) {
      const prevSessionAverages = calculateAveragesOfSession(prevSession)
      const differenceOfAverages = calculateDifferenceOfAverages(lastSessionAverages, prevSessionAverages)

      return {
        1: lastSessionAverages[1],
        2: lastSessionAverages[2],
        3: lastSessionAverages[3],
        d1: differenceOfAverages[1],
        d2: differenceOfAverages[2],
        d3: differenceOfAverages[3],
        c: lastSession.answeredChatIds.length
      } satisfies StatsResp
    }

    return {
      1: lastSessionAverages[1],
      2: lastSessionAverages[2],
      3: lastSessionAverages[3],
      c: lastSession.answeredChatIds.length
    } satisfies StatsResp
  }

  return {} satisfies StatsResp
})

service.get<{ Result: ChartDataResp }>('/chartsData', () => {
  const db = new JSONDB(process.env['DB_FILE']!)
  const sessions: Session[] = db.get('sessions') ?? []

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]

    if (session.answers.length === 0) {
      sessions.splice(i, 1)
      i -= 1
    } else {
      break
    }
  }

  return sessions
    .sort((a, b) => {
      const timeA = new Date(a.ts).getTime()
      const timeB = new Date(b.ts).getTime()

      return timeA - timeB
    })
    .map(session => {
      return {
        t: session.ts,
        ...calculateAveragesOfSession(session)
      }
    })
})

service.get<{ Result: TextFeedbackResp }>('/textFeedback', () => {
  const db = new JSONDB(process.env['DB_FILE']!)
  const sessions: Session[] = db.get('sessions') ?? []
  const freeFormFeedbacks: FreeFormFeedback[] = db.get('freeFormFeedbacks') ?? []

  for (let i = 0; i < sessions.length; i++) {
    const session = sessions[i]

    if (session.answers.length === 0) {
      sessions.splice(i, 1)
      i -= 1
    } else {
      break
    }
  }

  return {
    ss: sessions
      .map(s => ({
        id: s.id,
        t: s.ts,
        a: [
          ...(s.answers
            .filter(a => !a.feedbackDeleted)
            .filter(a => Boolean(a.feedback))
            .map(a => ({
              id: a.id,
              q: a.question,
              f: a.feedback,
              s: a.score
            }))),
          ...(s.textFeedbacks
            .filter(tf => !tf.deleted)
            .map(tf => ({
              id: tf.id,
              f: tf.feedback
            }))
          )
        ]
      }))
      .filter(s => Boolean(s.a.length)),
    ff: freeFormFeedbacks
      .filter(it => it.kind === 'anonymous-feedback')
      .filter(it => !it.deleted)
      .map(it => ({
        id: it.id,
        t: it.ts,
        tx: it.text
      }))
  }
})

service.post<{
  Body: {
    sessionId: string
    feedbackType: 'a' | 'f'
    feedbackId: string
    username: string
    role: string
  }
}>('/sendMessage', {
  schema: {
    body: {
      type: 'object',
      required: ['sessionId', 'feedbackType', 'feedbackId'],
      properties: {
        sessionId: { type: 'string' },
        feedbackType: { enum: ['a', 'f'] },
        feedbackId: { type: 'string' },
        username: { type: 'string' },
        role: { type: 'string' }
      }
    }
  },
  async handler({ body: { sessionId, feedbackType, feedbackId: strFeedbackId, username, role } }) {
    const feedbackId = Number(strFeedbackId)
    const db = new JSONDB(process.env['DB_FILE']!)
    const sessions = db.get('sessions') as Session[] ?? []
    const session: Session = sessions[sessionId]
    let chatId: number | undefined

    if (session) {
      switch (feedbackType) {
        case 'a': {
          const answer = session.answers[feedbackId]
          chatId = answer.chatId
          break
        }
        case 'f': {
          const textFeedback = session.textFeedbacks[feedbackId]
          chatId = textFeedback.chatId
          break
        }
      }
    }

    if (chatId) {
      db.set('pendingMessages', [
        ...(db.get('pendingMessages') ?? []),
        {
          chatId,
          username: username.trim().startsWith('@') ? username.trim().slice(1).trim() : username.trim(),
          role: role.trim()
        }
      ])

      db.sync()
    }
  }
})

service.post<{
  Body: {
    sessionId: string
    feedbackType: 'a' | 'f'
    feedbackId: string
  }
}>('/deleteFeedback', {
  schema: {
    body: {
      type: 'object',
      required: ['sessionId', 'feedbackType', 'feedbackId'],
      properties: {
        sessionId: { type: 'string' },
        feedbackType: { enum: ['a', 'f'] },
        feedbackId: { type: 'string' },
      }
    }
  },
  async handler({ body: { sessionId, feedbackType, feedbackId: strFeedbackId } }) {
    const feedbackId = Number(strFeedbackId)
    const db = new JSONDB(process.env['DB_FILE']!)
    const sessions = db.get('sessions') as Session[] ?? []
    const session: Session = sessions[sessionId]

    if (session) {
      switch (feedbackType) {
        case 'a': {
          const answer = session.answers[feedbackId]
          answer.feedbackDeleted = true
          break
        }
        case 'f': {
          const feedback = session.textFeedbacks[feedbackId]
          feedback.deleted = true
          break
        }
      }

      db.set('sessions', sessions)
    }
  }
})

service.listen({
  port: Number(process.env['PORT'] ?? 3000),
  host: process.env['HOST'] ?? '0.0.0.0'
})
