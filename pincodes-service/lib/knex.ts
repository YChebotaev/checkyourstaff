import createKnex from 'knex'
import config from '../knexfile'
import { logger } from './logger'

export const knex = createKnex({
  ...config,
  log: {
    warn(message) {
      logger.warn(message)
    },
    error(message) {
      logger.error(message)
    },
    deprecate(message) {
      logger.info(message)
    },
    debug(message) {
      logger.debug(message)
    }
  }
})
