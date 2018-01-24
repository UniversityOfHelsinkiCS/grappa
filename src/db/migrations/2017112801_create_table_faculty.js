exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('faculty', function (table) {
            table.increments('facultyId').primary();
            table.string('name');
        })
    ]);
};

exports.down = async function(knex) {
    await knex.schema.dropTable('faculty');
};
