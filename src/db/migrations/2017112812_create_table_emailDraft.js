exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('emailDraft', (table) => {
            table.increments('emailDraftId').primary();
            table.integer('programme');
            table.foreign('programme').references('programme.programmeId');
            table.text('type').notNullable();
            table.text('title');
            table.text('body');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('emailDraft');
};
