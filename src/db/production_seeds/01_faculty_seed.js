exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('previousagreements').del() // Foreign key violation
    await knex('agreementPerson').del() // Foreign key violation
    await knex('attachment').del() // Foreign key violation
    await knex('agreement').del() // Foreign key violation
    await knex('studyfield').del() // Foreign key violation
    await knex('agreementDraftPerson').del() // Foreign key violation
    await knex('agreementDraft').del() // Foreign key violation
    await knex('personWithRole').del() // Foreign key violation
    await knex('notification').del() // Foreign key violation
    await knex('meetingProgramme').del() // Foreign key violation
    await knex('programme').del() // Foreign key violation
    await knex('faculty').del()
    // Inserts seed entries
    return knex('faculty').insert([
        {
            name: 'Faculty of Science'
        }
    ]);
};
