exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('councilmeeting', function (table) {
            table.increments('councilmeetingId').primary();
            table.date('date');
            table.date('instructorDeadline');
            table.date('studentDeadline');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('councilmeeting');
};