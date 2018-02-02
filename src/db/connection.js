import logger from '../util/logger';

require('dotenv').config();
const config = require('./knexfile.js');
const knexModule = require('knex');

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'not working';
logger.debug(`ENVIRONMENT IS ${env}`);

let knex;

module.exports.getKnex = () => {
    if (knex)
        return knex;

    if (env !== 'test') {
        knex = knexModule(config[env]);

        knex.migrate.latest().then((msg) => {
            logger.info('KNEX MIGRATE SUCCESS', { msg });
        }).catch((err) => {
            logger.info('KNEX MIGRATE FAILURE', { err });
        });

        return knex;
    }

    config[env].searchPath = process.env.DB_SCHEMA;
    knex = knexModule(config[env]);

    return knex;
};
