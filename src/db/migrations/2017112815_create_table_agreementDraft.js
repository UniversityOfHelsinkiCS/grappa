exports.up = knex => Promise.all([
    knex.schema.createTable('agreementDraft', (table) => {
        table.increments('agreementDraftId').primary();
        table.integer('mainSupervisorId').unsigned();
        table.foreign('mainSupervisorId').references('personWithRole.personRoleId').onDelete('SET NULL');
        table.string('studentEmail');
        table.string('studentFirstname');
        table.string('studentLastname');
        table.string('studentNumber');
        table.string('studentAddress');
        table.string('studentPhone');
        table.string('studentMajor');
        table.string('thesisTitle');
        table.date('thesisStartDate');
        table.date('thesisCompletionEta');
        table.string('thesisPerformancePlace');
        table.integer('studentGradeGoal');
        table.string('studentTime');
        table.string('supervisorTime');
        table.string('intermediateGoal');
        table.string('meetingAgreement');
        table.string('other');
    })
]);

exports.down = async (knex) => {
    knex.schema.dropTable('agreementDraft');
};
