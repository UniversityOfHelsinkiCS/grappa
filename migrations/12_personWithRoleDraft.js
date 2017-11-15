exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('personWithRoleDraft', function (table) {
            table.increments('personRoleDraftId').primary();
            table.integer('agreementDraftId').unsigned();
            table.foreign('agreementDraftId').references('agreementDraft.agreementDraftId');
            table.integer('personId').unsigned();
            table.foreign('personId').references('person.personId');
            table.integer('roleId').unsigned();
            table.foreign('roleId').references('role.roleId');
            table.integer('studyfieldId').unsigned();
            table.foreign('studyfieldId').references('studyfield.studyfieldId');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('personWithRoleDraft');
};