exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('thesis', function (table) {
            table.increments('thesisId').primary();
            table.string('thesisTitle');
            table.date('startDate');
            table.date('completionEta');
            table.string('performancePlace');
            table.string('urkund');
            table.string('grade').defaultTo('-');
            table.string('graderEval');
            table.integer('userId');
            table.boolean('printDone').defaultTo(false);
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('thesis');
};
