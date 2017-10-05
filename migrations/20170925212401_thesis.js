
exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('thesis', function (table) {
            table.increments('thesisId').primary();
            table.string('authorFirstname');
            table.string('authorLastname');
            table.string('authorEmail');
            table.string('title');
            table.string('urkund');
            table.integer('grade');
            table.string('graderEval');
            table.integer('studyFieldId');
            table.integer('userId');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    knex.schema.dropTable('thesis');
};
