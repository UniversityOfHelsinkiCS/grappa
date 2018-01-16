exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('programme', function (table) {
            table.increments('programmeId').primary();
            table.integer('facultyId').unsigned();
            table.foreign('facultyId').references('faculty.facultyId');
            table.string('name');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('programme');
};
