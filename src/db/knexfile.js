const setTimezone = function(connection, callback) {
    connection.query('SET timezone = "Europe/Helsinki";', (err) => {
        callback(err, connection);
    });
}

module.exports = {
    development: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
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
        connection: process.env.DATABASE_URL,
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
        connection: process.env.DATABASE_URL,
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/production_seeds'
        }
    }
}
