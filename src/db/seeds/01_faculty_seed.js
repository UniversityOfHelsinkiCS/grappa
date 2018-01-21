const faculties = require('../../mockdata/MockFaculties')

exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('faculty').del()
        .then(() => {
            // Inserts seed entries
            return knex('faculty').insert(faculties);
        });
};
