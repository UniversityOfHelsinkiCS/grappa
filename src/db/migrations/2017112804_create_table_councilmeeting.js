exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('councilmeeting', function (table) {
            table.increments('councilmeetingId').primary();
            table.date('date').notNullable();
            table.date('instructorDeadline');
            table.date('studentDeadline');
            table.integer('programmeId').notNullable();
            table.foreign('programmeId').references('programme.programmeId');
        })
    ]);
};

exports.down = async function (knex) {
    await knex.schema.dropTable('councilmeeting');
};
