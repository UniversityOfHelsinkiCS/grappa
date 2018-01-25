exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('agreementPerson', (table) => {
            table.integer('agreementId').unsigned();
            table.foreign('agreementId').references('agreement.agreementId').onDelete('CASCADE');
            table.integer('personRoleId').unsigned(); //grader
            table.foreign('personRoleId').references('personWithRole.personRoleId').onDelete('CASCADE');
            table.integer('approverId').unsigned();
            table.foreign('approverId').references('personWithRole.personRoleId').onDelete('CASCADE');
            table.date('approvalDate');
            table.boolean('approved');
            table.string('statement');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('agreementPerson');
};
