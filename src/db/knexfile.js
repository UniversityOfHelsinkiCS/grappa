module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './src/db/grappa2db.sqlite'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        }
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './src/db/migrations'
        },
        seeds: {
            directory: './src/db/seeds'
        },
        //debug: true
    }
}
