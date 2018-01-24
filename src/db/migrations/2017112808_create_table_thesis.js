exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('thesis', (table) => {
            table.increments('thesisId').primary();
            table.integer('councilmeetingId').unsigned();
            table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId');
            table.string('title');
            table.string('urkund');
            table.string('grade').defaultTo('-');
            table.boolean('printDone').defaultTo(false);
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('thesis');
};
