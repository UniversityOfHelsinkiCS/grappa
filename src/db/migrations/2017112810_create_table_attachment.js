exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('attachment', function (table) {
            table.increments('attachmentId').primary();
            table.integer('agreementId').unsigned(); //author
            table.foreign('agreementId').references('agreement.agreementId');
            table.string('filename');
            table.string('type');
            table.boolean('savedOnDisk');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('attachment');
};