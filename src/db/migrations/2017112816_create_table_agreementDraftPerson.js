exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('agreementDraftPerson', (table) => {
            table.integer('agreementDraftId').unsigned();
            table.foreign('agreementDraftId').references('agreementDraft.agreementDraftId');
            table.integer('personRoleId').unsigned();
            table.foreign('personRoleId').references('personWithRole.personRoleId');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('agreementDraftPerson');
};
