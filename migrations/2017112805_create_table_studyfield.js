exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('studyfield', function (table) {
            table.increments('studyfieldId').primary();
            table.integer('facultyId').unsigned();
            table.foreign('facultyId').references('faculty.facultyId');
            table.string('name');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('studyfield');
};