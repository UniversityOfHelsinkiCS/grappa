module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './grappa2db.sqlite'
        }
    },
    test: {
        client: 'sqlite3',
        connection: {
            filename: './grappa2db_test.sqlite'
        }
    }
}
