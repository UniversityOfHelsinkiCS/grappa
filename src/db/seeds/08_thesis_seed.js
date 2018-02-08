const theses = require('../../mockdata/MockTheses')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('thesis').del()
        .then(() =>
            // Inserts seed entries
            knex('thesis').insert(theses)
        );
};
