exports.up = knex => Promise.all([
    knex.schema.createTable('thesis', (table) => {
        table.increments('thesisId').primary();
        table.integer('councilmeetingId').unsigned();
        table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId').onDelete('SET NULL');
        table.string('title');
        table.string('urkund');
        table.string('grade').defaultTo('-');
        table.boolean('printDone').defaultTo(false);
    })
]);

exports.down = async (knex) => {
    knex.schema.dropTable('thesis');
};
