import { Keymask } from 'keymask'

const keymaskSeedStr = process.env['KEYMASK_SEED']
const keymaskSeed = new TextEncoder().encode(keymaskSeedStr)

export const keymask = new Keymask({
  seed: keymaskSeed.buffer,
  size: 7
})
