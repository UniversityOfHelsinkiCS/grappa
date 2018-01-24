exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('person', (table) => {
            table.increments('personId').primary();
            table.string('shibbolethId').unique();
            table.string('email');
            table.string('firstname');
            table.string('lastname');
            table.boolean('isRetired');
            table.string('studentNumber').unique();
            table.string('phone');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('persons');
};
