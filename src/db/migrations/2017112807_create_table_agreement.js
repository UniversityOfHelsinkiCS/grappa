exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('agreement', function(table) {
            table.increments('agreementId').primary();
            table.integer('authorId').unsigned(); // author
            table.foreign('authorId').references('person.personId');
            table.integer('thesisId').unsigned();
            table.foreign('thesisId').references('thesis.thesisId');
            table.integer('responsibleSupervisorId').unsigned();
            table.foreign('responsibleSupervisorId').references('personWithRole.personRoleId');
            table.integer('studyfieldId').unsigned();
            table.foreign('studyfieldId').references('studyfield.studyfieldId');
            table.boolean('fake');
            table.date('startDate');
            table.date('completionEta');
            table.string('performancePlace');
            table.integer('studentGradeGoal');
            table.string('studentWorkTime');
            table.string('supervisorWorkTime');
            table.string('intermediateGoal');
            table.string('meetingAgreement');
            table.string('other');
            table.string('whoNext').defaultTo('supervisor'); // student creates agreement
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('agreement');
};
