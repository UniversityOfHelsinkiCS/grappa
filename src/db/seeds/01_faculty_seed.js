const faculties = require('../../mockdata/MockFaculties')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('faculty').del()
    return knex('faculty').insert(faculties);
};
