/*
Migration to crate additionalInfo column in Thesis table.
*/
exports.up = knex => Promise.all([
    knex.schema.table('thesis', (table) => {
        table.text('additionalInfo')
    })
])

exports.down = async (knex) => {
    await knex.schema.table('thesis', (table) => {
        table.dropColumn('additionalInfo')
    })
}
