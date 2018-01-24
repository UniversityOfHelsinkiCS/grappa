exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('attachment', function (table) {
            table.increments('attachmentId').primary();
            table.integer('agreementId').unsigned(); //author
            table.foreign('agreementId').references('agreement.agreementId');
            table.string('filename');
            table.string('originalname');
            table.string('mimetype');
            table.string('label');
            table.boolean('savedOnDisk');
        })
    ]);
};

exports.down = async function (knex) {
    await knex.schema.dropTable('attachment');
};
