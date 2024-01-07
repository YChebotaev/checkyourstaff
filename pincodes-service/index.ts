import { fastify } from 'fastify'
import {
  generatePinCode,
  generatorGetByTenantId,
  generatorSetGeneratedCount,
  generatorSetSize,
  pinCodeCreate,
  pinCodeGetByCode,
  logger
} from './lib'
import type { CreateBody, GetBody } from './types'

const service = fastify({ logger })

service.post<{
  Body: GetBody
}>('/get', {
  schema: {
    body: {
      type: 'object',
      required: ['tenantId', 'code'],
      properties: {
        tenantId: { type: 'string' },
        code: { type: 'string' }
      }
    }
  },
  async handler({ body: { tenantId: strTenantId, code } }, reply) {
    const tenantId = Number(strTenantId)

    const pinCode = await pinCodeGetByCode(tenantId, code)

    if (!pinCode) {
      return reply.callNotFound()
    }

    return {
      payload: pinCode.payload
    }
  }
})

service.post<{
  Body: CreateBody
}>('/create', {
  schema: {
    body: {
      type: 'object',
      required: ['tenantId', 'payload'],
      properties: {
        tenantId: { type: 'string' },
        payload: {}
      }
    }
  },
  async handler({ body: { tenantId: strTenantId, payload } }, reply) {
    const tenantId = Number(strTenantId)
    const generator = await generatorGetByTenantId(tenantId)

    if (!generator) {
      return reply.callNotFound()
    }

    const maxNumber = Math.pow(10, generator.size)

    if (generator.generatedCount >= maxNumber - 300) {
      generator.size += 1

      await generatorSetSize(generator.id, generator.size)
    }

    let code: string

    do {
      code = generatePinCode(generator.size)

      const pinCode = await pinCodeGetByCode(tenantId, code)

      if (!pinCode) {
        break
      }
    } while (true)

    await pinCodeCreate({
      tenantId,
      generatorId: generator.id,
      code,
      payload
    })

    await generatorSetGeneratedCount(generator.id, generator.generatedCount + 1)

    return {
      code
    }
  }
})

service.listen({
  port: Number(process.env['PORT'] ?? 3002),
  host: process.env['HOST'] ?? '0.0.0.0'
})
