// @ts-nocheck

import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import { isValidPhoneNumber } from 'libphonenumber-js'
import { logger } from './lib'
import type { AuthSignupBody } from './types'

const app = fastify({ logger })

app.register(fastifyCors, {
  origin: true,
  credentials: true
})

app.post<{
  Body: AuthCheckBody
}>('/auth/check', {
  schema: {
    body: {
      type: 'object',
      properties: {
        accessToken: { type: 'string' }
      }
    }
  },
  async handler({ body: { accessToken } }) {
    return {
      authenticated: Boolean(accessToken)
    }
  }
})

app.post<{
  Body: AuthSignupBody
}>('/auth/signup', {
  schema: {
    body: {
      type: 'object',
      required: [
        'name',
        'phone',
        'email',
        'password',
        'passwordConfirm'
      ],
      properties: {
        name: { type: 'string' },
        phone: { type: 'string' },
        email: { type: 'string' },
        password: { type: 'string' },
        passwordConfirm: { type: 'string' },
      }
    }
  },
  async handler({ body: { name, phone, email, password, passwordConfirm } }, reply) {
    name = name.trim()
    phone = phone.trim()
    email = email.trim()

    if (name === '') {
      return {
        error: 'auth-signup-name-empty'
      }
    }

    if (phone === '') {
      return {
        error: 'auth-signup-phone-empty'
      }
    }

    if (!isValidPhoneNumber(phone)) {
      return {
        error: 'auth-signup-phone-invalid'
      }
    }

    if (email === '') {
      return {
        error: 'auth-signup-email-empty'
      }
    }

    if (!email.includes('@')) {
      return {
        error: 'auth-signup-email-invalid'
      }
    }

    if (password === '') {
      return {
        error: 'auth-signup-password-empty'
      }
    }

    if (password !== passwordConfirm) {
      return {
        error: 'auth-signup-password-mismatch'
      }
    }

    return {
      ok: true,
      accessToken: '--access-token--',
      refreshToken: '--refresh-token--'
    }
  }
})

app.listen({
  port: Number(process.env['PORT'] ?? 3001),
  host: process.env['HOST'] ?? '0.0.0.0'
})
