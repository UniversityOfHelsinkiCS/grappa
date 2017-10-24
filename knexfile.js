module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './grappa2db.sqlite'
        },
        useNullAsDefault: true
    }, 
    test: {
        client: 'sqlite3',
        connection: {
            filename: ':memory:'
        },
        useNullAsDefault: true
    }
}
