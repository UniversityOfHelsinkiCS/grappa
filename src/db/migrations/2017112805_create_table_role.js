exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('role', (table) => {
            table.increments('roleId').primary();
            table.string('name');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('role');
};