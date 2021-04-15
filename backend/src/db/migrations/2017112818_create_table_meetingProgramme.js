exports.up = knex => Promise.all([
    knex.schema.createTable('meetingProgramme', (table) => {
        table.integer('councilmeetingId')
        table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId').onDelete('SET NULL')
        table.integer('programmeId')
        table.foreign('programmeId').references('programme.programmeId').onDelete('SET NULL')
    })
])

exports.down = async (knex) => {
    knex.schema.dropTable('meetingProgramme')
}
