exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('emailInvite', function(table) {
            table.increments('emailInviteId').primary();
            table.integer('agreement');
            table.text('email').notNullable();
            table.text('code').notNullable();
            table.text('type');

            table.foreign('agreement').references('agreement.agreementId');
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('emailInvite');
};
