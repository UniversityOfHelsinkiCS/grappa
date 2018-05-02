/*
Migration to create table roleRequest.
*/
exports.up = async knex => Promise.all([
    knex.schema.createTable('roleRequest', (table) => {
        table.increments('roleRequestId').primary()
        table.integer('personId').unsigned()
        table.foreign('personId').references('person.personId').onDelete('SET NULL')
        table.integer('roleId').unsigned()
        table.foreign('roleId').references('role.roleId').onDelete('SET NULL')
        table.integer('programmeId').unsigned()
        table.foreign('programmeId').references('programme.programmeId').onDelete('SET NULL')
        table.boolean('handled')
        table.boolean('granted')
        table.integer('granterId').unsigned()
        table.foreign('granterId').references('person.personId').onDelete('SET NULL')
    })
])

exports.down = async (knex) => {
    await knex.schema.dropTable('roleRequest')
}
