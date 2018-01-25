exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('agreement', (table) => {
            table.increments('agreementId').primary();
            table.integer('authorId').unsigned(); // author
            table.foreign('authorId').references('person.personId').onDelete('CASCADE');
            table.integer('thesisId').unsigned();
            table.foreign('thesisId').references('thesis.thesisId').onDelete('CASCADE');
            table.integer('responsibleSupervisorId').unsigned();
            table.foreign('responsibleSupervisorId').references('personWithRole.personRoleId').onDelete('CASCADE');
            table.integer('studyfieldId').unsigned();
            table.foreign('studyfieldId').references('studyfield.studyfieldId').onDelete('CASCADE');
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

exports.down = async (knex) => {
    knex.schema.dropTable('agreement');
};
