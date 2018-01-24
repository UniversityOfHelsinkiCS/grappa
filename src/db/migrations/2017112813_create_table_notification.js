exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('notification', (table) => {
            table.increments('notificationId').primary();
            table.text('type').notNullable();
            table.integer('userId');
            table.foreign('userId').references('person.personId');
            table.timestamp('timestamp').defaultTo(knex.fn.now());
            table.integer('programmeId');
            table.foreign('programmeId').references('programme.programmeId');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('notification');
};
