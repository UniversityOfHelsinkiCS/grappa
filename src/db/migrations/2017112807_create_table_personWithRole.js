exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable('personWithRole', (table) => {
            table.increments('personRoleId').primary();
            table.integer('personId').unsigned().notNullable();
            table.foreign('personId').references('person.personId').onDelete('CASCADE');
            table.integer('roleId').unsigned().notNullable();
            table.foreign('roleId').references('role.roleId').onDelete('CASCADE');
            table.integer('programmeId').unsigned();
            table.foreign('programmeId').references('programme.programmeId').onDelete('CASCADE');
        })
    ]);
};

exports.down = async (knex) => {
    knex.schema.dropTable('personWithRole');
};
