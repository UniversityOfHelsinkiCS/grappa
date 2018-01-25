const personWithRole = require('../../mockdata/MockPersonRoleFields');

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementDraftPerson').del() // Foreign key violation
    await knex('agreementDraft').del() // Foreign key violation
    await knex('personWithRole').del()
    // Inserts seed entries
    return knex('personWithRole').insert(personWithRole);
};
