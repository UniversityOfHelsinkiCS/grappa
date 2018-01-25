exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('previousagreements', (table) => {
            table.integer('agreementId');
            table.foreign('agreementId').references('agreement.agreementId').onDelete('CASCADE')
            table.integer('previousAgreementId');
            table.foreign('previousAgreementId').references('agreement.agreementId').onDelete('CASCADE')
            table.primary(['agreementId','previousAgreementId']);
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('previousagreements');
};
