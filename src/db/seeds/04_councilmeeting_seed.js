const councilmeetings = require('../../mockdata/MockCouncilmeetings');

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('thesis').del() // Foreign key violation
    await knex('councilmeeting').del()
    // Inserts seed entries
    return knex('councilmeeting').insert(councilmeetings);
};