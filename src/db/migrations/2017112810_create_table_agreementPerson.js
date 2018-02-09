exports.up = knex => Promise.all([
    knex.schema.createTable('agreementPerson', (table) => {
        table.integer('agreementId').unsigned();
        table.foreign('agreementId').references('agreement.agreementId').onDelete('SET NULL');
        table.integer('personRoleId').unsigned(); // grader
        table.foreign('personRoleId').references('personWithRole.personRoleId').onDelete('SET NULL');
        table.integer('approverId').unsigned();
        table.foreign('approverId').references('personWithRole.personRoleId').onDelete('SET NULL');
        table.date('approvalDate');
        table.boolean('approved');
        table.string('statement');
    })
]);

exports.down = async (knex) => {
    knex.schema.dropTable('agreementPerson');
};
