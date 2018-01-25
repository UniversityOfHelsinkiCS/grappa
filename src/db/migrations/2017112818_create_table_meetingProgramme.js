exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('meetingProgramme', (table) => {
            table.integer('councilmeetingId');
            table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId').onDelete('CASCADE')
            table.integer('programmeId');
            table.foreign('programmeId').references('programme.programmeId').onDelete('CASCADE')
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('meetingProgramme');
};
