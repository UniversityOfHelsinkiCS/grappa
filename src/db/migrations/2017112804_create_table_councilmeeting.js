exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('councilmeeting', (table) => {
            table.increments('councilmeetingId').primary();
            table.date('date').notNullable();
            table.date('instructorDeadline');
            table.date('studentDeadline');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('councilmeeting');
};
