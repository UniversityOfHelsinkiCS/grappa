exports.up = function (knex, Promise) {
    return Promise.all([

        knex.schema.createTable('agreement', function (table) {
            table.increments('agreementId').primary();
            table.integer('authorId').unsigned(); //author
            table.foreign('authorId').references('person.personId');
            table.integer('thesisId').unsigned();
            table.foreign('thesisId').references('thesis.thesisId');
            table.integer('responsibleSupervisorId').unsigned();
            table.foreign('responsibleSupervisorId').references('personRoleField.personRoleId');
            table.integer('studyFieldId').unsigned();
            table.foreign('studyFieldId').references('studyfield.studyfieldId');
            table.boolean('fake');
            table.integer('studentGradeGoal');
            table.string('studentWorkTime');
            table.string('supervisorWorkTime');
            table.string('intermediateGoal');
            table.string('meetingAgreement');
            table.string('other');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('agreement');
};