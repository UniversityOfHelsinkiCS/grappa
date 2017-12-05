exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreementDraftPerson').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreementDraftPerson').insert([
                {
                    personRoleId: 1,
                    agreementDraftId: 1,
                },
                {
                    personRoleId: 2,
                    agreementDraftId: 2,
                }
            ]);
        });
};