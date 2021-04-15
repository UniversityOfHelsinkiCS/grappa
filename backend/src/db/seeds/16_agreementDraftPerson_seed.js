exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementDraftPerson').del()
    // Inserts seed entries
    return knex('agreementDraftPerson').insert([
        {
            personRoleId: 1,
            agreementDraftId: 1
        },
        {
            personRoleId: 2,
            agreementDraftId: 2
        }
    ])
    // return knex.raw('ALTER SEQUENCE "agreementDraftPerson_agreementDraftPersonId_seq" RESTART WITH 50')
}
