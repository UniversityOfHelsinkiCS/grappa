exports.up = knex => Promise.all([
    knex.schema.createTable('agreementDraftPerson', (table) => {
        table.integer('agreementDraftId').unsigned()
        table.foreign('agreementDraftId').references('agreementDraft.agreementDraftId').onDelete('SET NULL')
        table.integer('personRoleId').unsigned()
        table.foreign('personRoleId').references('personWithRole.personRoleId').onDelete('SET NULL')
    })
])

exports.down = async (knex) => {
    knex.schema.dropTable('agreementDraftPerson')
}
