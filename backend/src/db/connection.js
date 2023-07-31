import logger from '../util/logger'

require('dotenv').config()
const config = require('./knexfile.js')
const knexModule = require('knex')

const { NODE_ENV } = process.env
const env = NODE_ENV === 'staging' ? 'production' : NODE_ENV || 'not working'

let knex

module.exports.getKnex = () => {
    if (knex)
        return knex

    if (env !== 'test') {
        knex = knexModule(config[env])
        knex.migrate.latest().then((msg) => {
            if (msg[1].length) {
                logger.info('Successful migrate', { msg })
            }
        }).catch((err) => {
            logger.error('Migrate failed', { err })
        })
        return knex
    }

    config[env].searchPath = process.env.DB_SCHEMA
    knex = knexModule(config[env])

    return knex
}
