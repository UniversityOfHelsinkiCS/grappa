exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('emailInvite', function (table) {
            table.increments('emailInviteId').primary();
            table.integer('agreement');
            table.integer('programme');
            table.integer('role');
            table.text('email').notNullable();
            table.text('token').notNullable().unique();
            table.text('type').notNullable();
            table.boolean('used').default(false);

            table.foreign('agreement').references('agreement.agreementId');
            table.foreign('role').references('role.roleId');
            table.foreign('programme').references('programme.programmeId');
        })
    ]);
};

exports.down = async function(knex) {
    await knex.schema.dropTable('emailInvite');
};
