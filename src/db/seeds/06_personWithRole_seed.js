const theses = require('../../mockdata/MockPersonRoleFields');

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('personWithRole').del()
        .then(function () {
            // Inserts seed entries
            return knex('personWithRole').insert(personWithRole);
        });
};
