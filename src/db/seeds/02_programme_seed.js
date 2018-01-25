const programmes = require('../../mockdata/MockProgrammes');

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('programme').del();
    return knex('programme').insert(programmes);
};
