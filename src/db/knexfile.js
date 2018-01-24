module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './src/db/grappa2db.sqlite'
        },
        // client: 'pg',
        // connection: process.env.DATABASE_URL,
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        }
    },
    test: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
        searchPath: ['grappa_test', 'public'],
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        },
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
