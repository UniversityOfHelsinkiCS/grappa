exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('notification', (table) => {
            table.increments('notificationId').primary();
            table.text('type').notNullable();
            table.integer('userId');
            table.foreign('userId').references('person.personId').onDelete('CASCADE');
            table.timestamp('timestamp').defaultTo(knex.fn.now());
            table.integer('programmeId');
            table.foreign('programmeId').references('programme.programmeId').onDelete('CASCADE');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('notification');
};
