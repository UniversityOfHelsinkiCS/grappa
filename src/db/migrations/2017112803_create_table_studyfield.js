exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('studyfield', (table) => {
            table.increments('studyfieldId').primary();
            table.integer('programmeId').unsigned();
            table.foreign('programmeId').references('programme.programmeId');
            table.string('name');
        })
    ]);
};

exports.down = async (knex) => {
    await knex.schema.dropTable('studyfield');
};
