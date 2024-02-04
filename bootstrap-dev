import { exec } from 'node:child_process'
import { within, cd, sleep } from 'zx'

await Promise.all([
  within(async () => {
    cd('console-backend')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('control-bot')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('pincodes-service')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('polling-bot')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('webapp-backend')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('workers')

    const p = exec('npm run dev')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('console')

    const p = exec('npm run dev -- --port 5173')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    cd('webapp')

    const p = exec('npm run dev -- --port 5174')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    await sleep(5000)

    const p = exec('./loophole http 3001 localhost --hostname console-backend-checkyourstaff')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    await sleep(15000)

    const p = exec('./loophole http 3003 localhost --hostname webapp-backend-checkyourstaff')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    await sleep(15000)

    const p = exec('./loophole http 5173 localhost --hostname console-checkyourstaff')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
  within(async () => {
    await sleep(15000)

    const p = exec('./loophole http 5174 localhost --hostname webapp-checkyourstaff')
    p.stdout.pipe(process.stdout)
    p.stderr.pipe(process.stderr)
  }),
])
