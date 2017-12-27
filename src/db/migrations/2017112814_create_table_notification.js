exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('notification', function(table) {
            table.increments('notificationId').primary();
            table.text('type').notNullable();
            table.integer('userId');
            table.foreign('userId').references('person.personId');
            table.timestamp('timestamp').defaultTo(knex.fn.now());
            table.integer('studyfieldId');
            table.foreign('studyfieldId').references('studyfield.studyfieldId');
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('notification');
};
