exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('thesis', function (table) {
            table.increments('thesisId').primary();
            table.integer('councilmeetingId').unsigned();
            table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId');
            table.string('title');
            table.string('urkund');
            table.string('grade').defaultTo('-');
            table.string('graderEval');
            table.boolean('printDone').defaultTo(false);
        })
    ]);
};

exports.down = async function (knex) {
    await knex.schema.dropTable('thesis');
};
