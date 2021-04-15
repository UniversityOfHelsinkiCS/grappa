exports.up = knex => Promise.all([
    knex.schema.createTable('role', (table) => {
        table.increments('roleId').primary()
        table.string('name')
    })
])

exports.down = async (knex) => {
    knex.schema.dropTable('role')
}
