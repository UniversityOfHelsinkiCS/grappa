const config = require('../util/config')

const setTimezone = (connection, callback) => {
    connection.query('SET timezone = "Europe/Helsinki";', (err) => {
        callback(err, connection)
    })
}

module.exports = {
    development: {
        client: 'pg',
        connection: config.DATABASE_URL,
        searchPath: ['public'],
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        },
        pool: {
            afterCreate: setTimezone
        }
    },
    test: {
        client: 'pg',
        connection: config.DATABASE_URL,
        searchPath: ['grappa_test'],
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        },
        pool: {
            afterCreate: setTimezone
        }
    },
    production: {
        client: 'pg',
        connection: config.DATABASE_URL,
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/production_seeds'
        }
    }
}
