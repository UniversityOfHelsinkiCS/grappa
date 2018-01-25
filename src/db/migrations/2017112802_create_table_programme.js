exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('programme', (table) => {
            table.increments('programmeId').primary();
            table.integer('facultyId').unsigned();
            table.foreign('facultyId').references('faculty.facultyId').onDelete('SET NULL');
            table.string('name');
        })
    ]);
};

exports.down = async (knex) => {
    await knex.schema.dropTable('programme');
};
