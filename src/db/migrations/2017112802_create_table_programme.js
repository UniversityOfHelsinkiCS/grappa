exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('programme', (table) => {
            table.increments('programmeId').primary();
            table.integer('facultyId').unsigned();
            table.foreign('facultyId').references('faculty.facultyId');
            table.string('name');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('programme');
};
