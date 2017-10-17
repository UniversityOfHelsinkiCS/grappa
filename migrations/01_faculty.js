exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('faculty', function (table) {
            table.increments('facultyId').primary();
            table.string('name');
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('faculty');
};
