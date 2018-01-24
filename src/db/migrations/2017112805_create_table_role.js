exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('role', function (table) {
            table.increments('roleId').primary();
            table.string('name');
        })
    ]);
};

exports.down = async function (knex) {
    await knex.schema.dropTable('role');
};
