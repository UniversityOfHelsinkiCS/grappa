const persons = require('../../mockdata/MockPersons')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('person').del()
        .then(() =>
            // Inserts seed entries
            knex('person').insert(persons)
        );
};
