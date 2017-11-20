exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('agreementPerson', function (table) {
            table.integer('agreementId').unsigned();
            table.foreign('agreementId').references('agreement.agreementId');
            table.integer('personRoleId').unsigned(); //grader
            table.foreign('personRoleId').references('personWithRole.personRoleId');
            table.integer('approverId').unsigned();
            table.foreign('approverId').references('personWithRole.personRoleId');
            table.date('approvalDate');
            table.boolean('approved');
            table.string('statement');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('agreementPerson');
};