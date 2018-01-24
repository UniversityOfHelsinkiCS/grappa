exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('emailDraft', function(table) {
            table.increments('emailDraftId').primary();
            table.integer('programme');
            table.foreign('programme').references('programme.programmeId');
            table.text('type').notNullable();
            table.text('title');
            table.text('body');
        })
    ]);
};

exports.down = async function(knex) {
    await knex.schema.dropTable('emailDraft');
};
