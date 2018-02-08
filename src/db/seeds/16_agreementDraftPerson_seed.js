exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('agreementDraftPerson').del()
        .then(() =>
            // Inserts seed entries
            knex('agreementDraftPerson').insert([
                {
                    personRoleId: 1,
                    agreementDraftId: 1
                },
                {
                    personRoleId: 2,
                    agreementDraftId: 2
                }
            ])
        );
};
