exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('role', function (table) {
            table.increments('roleId').primary();
            table.string('name');
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('role');
};