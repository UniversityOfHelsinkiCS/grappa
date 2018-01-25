const councilmeetings = require('../../mockdata/MockCouncilmeetings');

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('councilmeeting').del()
    // Inserts seed entries
    return knex('councilmeeting').insert(councilmeetings);
};