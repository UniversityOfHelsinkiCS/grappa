exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('person', function (table) {
            table.increments('personId').primary();
            table.string('shibbolethId').unique();
            table.string('email');
            table.string('firstname');
            table.string('lastname');
            table.string('title')
            table.boolean('isRetired');
            table.string('studentNumber').unique();
            table.string('address');
            table.string('phone');
            table.string('major');
            table.timestamps();
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('persons');
};
