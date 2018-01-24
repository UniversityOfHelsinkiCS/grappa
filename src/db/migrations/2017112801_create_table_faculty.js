exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('faculty', (table) => {
            table.increments('facultyId').primary();
            table.string('name');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('faculty');
};
