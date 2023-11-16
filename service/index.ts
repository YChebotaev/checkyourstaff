// @ts-nocheck

import { fastify } from "fastify"
import fastifyCors from '@fastify/cors'
import pino from 'pino'
import JSONDB from 'simple-json-db'
import { groupBy } from 'lodash'
import type { Session } from '@checkyourstaff/bot/types'

const logger = pino()
const service = fastify({ logger })

service.register(fastifyCors, {
  origin: true
})

service.get<{
  Params: {
    question_id: string
  }
}>('/chart_data', () => {
  const db = new JSONDB(process.env['DB_FILE']!)
  const sessions: Session[] = db.get('sessions') ?? []

  for (let i=0; i<sessions.length; i++) {
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

      return {
        t: session.ts,
        ...avgScoresByQuestion
      }
    })
})

service.listen({
  path: '/api',
  port: Number(process.env['PORT'] ?? 3000),
  host: process.env['HOST'] ?? '0.0.0.0'
})
