exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('agreementDraftPerson', function (table) {
            table.integer('agreementDraftId').unsigned();
            table.foreign('agreementDraftId').references('agreementDraft.agreementDraftId');
            table.integer('personRoleId').unsigned();
            table.foreign('personRoleId').references('personWithRole.personRoleId');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('agreementDraftPerson');
};