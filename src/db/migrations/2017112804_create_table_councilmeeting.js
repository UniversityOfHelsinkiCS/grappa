exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('councilmeeting', (table) => {
            table.increments('councilmeetingId').primary();
            table.date('date').notNullable();
            table.date('instructorDeadline');
            table.date('studentDeadline');
            table.integer('programmeId').notNullable();
            table.foreign('programmeId').references('programme.programmeId');
        })
    ]);
};

exports.down = (knex) => {
    knex.schema.dropTable('councilmeeting');
};
