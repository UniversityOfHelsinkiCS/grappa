const theses = require('../../mockdata/MockTheses')

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('thesis').del()
        .then(function () {
            // Inserts seed entries
            return knex('thesis').insert(theses);
        });
};
