exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementDraftPerson').del() // Foreign key violation
    await knex('agreementDraft').del() // Foreign key violation
    await knex('personWithRole').del() // Foreign key violation
    await knex('studyfield').del() // Foreign key violation
    await knex('notification').del() // Foreign key violation
    await knex('meetingProgramme').del() // Foreign key violation
    await knex('programme').del()
    return knex('programme').insert([
        {
            facultyId: 1, // 1 OLD
            name: 'Department of Computer Science'
        },
        {
            facultyId: 1, // 2 NEW
            name: 'Master\'s Programme in Computer Science'
        },
        {
            facultyId: 1, // 3 NEW
            name: 'Master\'s Programme in Data Science'
        },
        {
            facultyId: 1, // 4 OLD
            name: 'Department of Chemistry'
        },
        {
            facultyId: 1, // 5 NEW
            name: 'Master\'s Programme in Chemistry and Molecular Sciences'
        },
        {
            facultyId: 1, // 6 OLD
            name: 'Department of Mathematics and Statistics'
        },
        {
            facultyId: 1, // 7 NEW
            name: 'Master\'s Programme in Mathematics and Statistics'
        }
    ]);
};
