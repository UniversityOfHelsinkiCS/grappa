module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './grappa2db.sqlite'
        },
        useNullAsDefault: true,
        migrations: {
            directory: './migrations'
        },
        seeds: {
            directory: './seeds'
        }
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        },
        useNullAsDefault: true,
        //debug: true
    }
}
