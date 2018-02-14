exports.up = knex => Promise.all([
    knex.schema.createTable('personWithRole', (table) => {
        table.increments('personRoleId').primary()
        table.integer('personId').unsigned().notNullable()
        table.foreign('personId').references('person.personId').onDelete('SET NULL')
        table.integer('roleId').unsigned().notNullable()
        table.foreign('roleId').references('role.roleId').onDelete('SET NULL')
        table.integer('programmeId').unsigned()
        table.foreign('programmeId').references('programme.programmeId').onDelete('SET NULL')
    })
])

exports.down = async (knex) => {
    knex.schema.dropTable('personWithRole')
}
