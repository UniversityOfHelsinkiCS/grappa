import logger from '../util/logger';

require('dotenv').config();
const config = require('./knexfile.js');

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'not working';
logger.debug(`ENVIRONMENT IS ${env}`);

const knex = require('knex')(config[env]);

if (env !== 'test') {
    knex.migrate.latest().then((msg) => {
        logger.info('KNEX MIGRATE SUCCESS', { msg });
    }).catch((err) => {
        logger.info('KNEX MIGRATE FAILURE', { err });
    });
}

module.exports = knex;
