exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('thesis', function (table) {
            table.increments('thesisId').primary();
            table.integer('councilmeetingId').unsigned();
            table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId');
            table.integer('userId').unsigned();
            table.foreign('userId').references('person.personId');
            table.string('thesisTitle');
            table.date('startDate');
            table.date('completionEta');
            table.string('performancePlace');
            table.string('urkund');
            table.string('grade').defaultTo('-');
            table.string('graderEval');
            table.boolean('printDone').defaultTo(false);
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('thesis');
};
