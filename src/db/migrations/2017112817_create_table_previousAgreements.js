exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('previousagreements', function (table) {
            table.integer('agreementId');
            table.foreign('agreementId').references('agreement.agreementId')
            table.integer('previousAgreementId');
            table.foreign('previousAgreementId').references('agreement.agreementId')
            table.primary(['agreementId','previousAgreementId']);
        })
    ]);
};

exports.down = async function (knex) {
    await knex.schema.dropTable('previousagreements');
};
