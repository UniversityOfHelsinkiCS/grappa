exports.up = knex => Promise.all([
    knex.schema.createTable('attachment', (table) => {
        table.increments('attachmentId').primary();
        table.integer('agreementId').unsigned(); // author
        table.foreign('agreementId').references('agreement.agreementId').onDelete('SET NULL');
        table.string('filename');
        table.string('originalname');
        table.string('mimetype');
        table.string('label');
        table.boolean('savedOnDisk');
    })
]);

exports.down = async (knex) => {
    knex.schema.dropTable('attachment');
};
