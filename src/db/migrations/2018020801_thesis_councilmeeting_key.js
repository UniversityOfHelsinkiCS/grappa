exports.up = knex => Promise.all([
    knex.schema.table('thesis', (table) => {
        table.dropForeign('councilmeetingId');
        table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId')
    })
]);

exports.down = knex => Promise.all([
    knex.schema.table('thesis', (table) => {
        table.dropForeign('councilmeetingId');
        table.foreign('councilmeetingId').references('councilmeeting.councilmeetingId').onDelete('SET NULL');
    })
]);
