const programmes = require('../../mockdata/MockProgrammes');

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementDraftPerson').del() // Foreign key violation
    await knex('agreementDraft').del() // Foreign key violation
    await knex('personWithRole').del() // Foreign key violation
    await knex('studyfield').del() // Foreign key violation
    await knex('notification').del() // Foreign key violation
    await knex('meetingProgramme').del() // Foreign key violation
    await knex('programme').del()
    return knex('programme').insert(programmes);
};
