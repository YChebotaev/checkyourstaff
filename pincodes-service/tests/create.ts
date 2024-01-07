import { describe, it } from 'node:test'
import { createClient } from '../client'

const client = createClient('http://localhost:3002', 1, '--dummy--token--')

describe('Generate pin code', () => {
  it('1 000 000 times', async () => {
    for (let i=0; i < 1000000; i++) {
      console.time(`create-${i}`)

      await client.create({ i })

      console.timeEnd(`create-${i}`)
    }
  })
})
