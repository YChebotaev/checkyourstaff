import { exec } from 'node:child_process'
import { $, cd } from 'zx'
import { GenericContainer } from 'testcontainers'
import { within } from 'zx'
import createKnex from 'knex'

/**
 * 
 * @param port {number}
 * @param hostname {string}
 */
const startLoophole = (port, hostname) => {
  return new Promise((resolve, reject) => {
    const p = exec(`./loophole http ${port} localhost --hostname ${hostname}`)
    p.once('exit', resolve)
    p.once('error', reject)
    p.stdout?.pipe(process.stdout)
    p.stderr?.pipe(process.stderr)
  })
}

/**
 * 
 * @param projects {string[]}
 */
const npmDev = async (projects) => {
  await Promise.all(
    projects.map(name => within(async () => {
      cd(`./${name}`)

      const p = exec('npm run dev')
      p.stdout?.pipe(process.stdout)
      p.stderr?.pipe(process.stderr)
    }))
  )
}

const startContainers = async () => {
  return (await Promise.all(
    Object.entries({
      'redis': 6379,
      'postgres': 5432,
      'dpage/pgadmin4': 443,
    }).map(([name, port]) => {
      const container = new GenericContainer(name)

      if (name === 'postgres') {
        container.withExposedPorts({
          container: port,
          host: port
        })
        container.withEnvironment({
          POSTGRES_DB: "postgres",
          POSTGRES_USER: "postgres",
          POSTGRES_PASSWORD: "postgres",
        })
      } else if (name === 'dpage/pgadmin4') {
        container.withExposedPorts({
          container: 80,
          host: 8080
        })
        container.withEnvironment({
          PGADMIN_DEFAULT_EMAIL: 'yury.79120345101@gmail.com',
          PGADMIN_DEFAULT_PASSWORD: 'admin'
        })
      } else if (name === 'redis') {
        container.withExposedPorts({
          container: port,
          host: port
        })
      }

      return container.start()
    })
  )).forEach(container => {
    process.once('beforeExit', () => container.stop())
  })
}

const initDb = async () => {
  const knex = createKnex({
    useNullAsDefault: true,
    debug: true,
    client: "pg",
    connection: {
      host: "localhost",
      user: 'postgres',
      password: 'postgres',
    }
  })

  // Create checkyourstaff db
  await knex.raw('CREATE USER checkyourstaff WITH PASSWORD \'Nu9ifPc9U3\';')
  await knex.raw('CREATE DATABASE checkyourstaff WITH OWNER = checkyourstaff;')
  await knex.raw('GRANT ALL PRIVILEGES ON DATABASE checkyourstaff TO checkyourstaff;')

  // Create pincodes db
  await knex.raw('CREATE USER pincodes WITH PASSWORD \'YOMdaH5kzLQ\';')
  await knex.raw('CREATE DATABASE pincodes WITH OWNER = pincodes;')
  await knex.raw('GRANT ALL PRIVILEGES ON DATABASE pincodes TO pincodes;')
}

const applyMigrations = () => Promise.all([
  within(async () => {
    cd('./persistence')

    await $`npm run migrate:latest`
  }),
  within(async () => {
    cd('./pincodes-service')

    await $`npm run migrate:latest`
  })
])

const startServices = async () => {
  await npmDev([
    'console',
    'console-backend',
    'webapp',
    'webapp-backend',
    'pincodes-service',
    'polling-bot',
    'control-bot',
    'workers',
  ])
}

const startTunnels = async () => {
  await Promise.all(
    Object.entries({
      'console-backend-checkyourstaff': 3001,
      'webapp-backend-checkyourstaff': 3003,
      'console-checkyourstaff': 5174,
      'webapp-checkyourstaff': 5173
    }).map(([hostname, port]) => startLoophole(port, hostname))
  )
}

// MAIN

await startContainers()
await initDb()
await applyMigrations()
await startServices()
await startTunnels()

setInterval(() => { }, 1000)
