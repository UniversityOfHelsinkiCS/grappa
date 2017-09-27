exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('contract', function (table) {
            table.increments('id').primary();
            table.string('studentName');
            table.string('studentNumber');
            table.string('studentAddress');
            table.string('studentEmail');
            table.string('studentMajor');
            table.string('thesisTitle');
            table.string('thesisStartDate');
            table.string('thesisCompletionEta');
            table.string('thesisPerformancePlace');
            table.string('thesisSupervisorMain');
            table.string('thesisSupervisorSecond');
            table.string('thesisSupervisorOther');
            table.string('thesisWorkStudentTime');
            table.string('thesisWorkSupervisorTime');
            table.string('thesisWorkIntermediateGoal');
            table.string('thesisWorkMeetingAgreement');
            table.string('thesisWorkOther');
            table.string('studentGradeGoal');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('contract');
};
