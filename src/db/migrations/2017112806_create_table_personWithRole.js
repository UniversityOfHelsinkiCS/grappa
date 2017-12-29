exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('personWithRole', function(table) {
            table.increments('personRoleId').primary();
            table.integer('personId').unsigned().notNullable();
            table.foreign('personId').references('person.personId');
            table.integer('roleId').unsigned().notNullable();
            table.foreign('roleId').references('role.roleId');
            table.integer('studyfieldId').unsigned();
            table.foreign('studyfieldId').references('studyfield.studyfieldId');
        })
    ]);
};

exports.down = function(knex, Promise) {
    knex.schema.dropTable('personWithRole');
};
