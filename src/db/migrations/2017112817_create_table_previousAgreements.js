exports.up = knex => Promise.all([
    knex.schema.createTable('previousagreements', (table) => {
        table.integer('agreementId');
        table.foreign('agreementId').references('agreement.agreementId').onDelete('SET NULL')
        table.integer('previousAgreementId');
        table.foreign('previousAgreementId').references('agreement.agreementId').onDelete('SET NULL')
        table.primary(['agreementId', 'previousAgreementId']);
    })
]);

exports.down = async (knex) => {
    knex.schema.dropTable('previousagreements');
};
