const previousAgreements = require('../../mockdata/MockPrevAgreements')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('previousagreements').del()
    // Inserts seed entries
    return knex('previousagreements').insert(previousAgreements);
};
