import { ajv } from './ajv'

export const validateInviteContacts = ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    required: ['type', 'value'],
    additionalProperties: false,
    properties: {
      type: { enum: ['email', 'phone'] },
      value: { type: 'string' }
    }
  }
})
