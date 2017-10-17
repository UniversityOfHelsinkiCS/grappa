exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('person', function (table) {
            table.increments('personId').primary();
            table.string('shibbolethId');
            table.string('email');
            table.string('firstname');
            table.string('lastname');
            table.string('title')
            table.boolean('isRetired');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('person');
};
