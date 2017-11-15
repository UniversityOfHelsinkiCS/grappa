exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('personWithRoleDraft').del()
        .then(function () {
            // Inserts seed entries
            return knex('personWithRoleDraft').insert([
                {
                    personRoleDraftId: 1,
                    agreementDraftId: 1,
                    personId: 1,
                    roleId: 1,
                    studyfieldId: 1,
                },
                {
                    personRoleDraftId: 2,
                    agreementDraftId: 2,
                    personId: 2,
                    roleId: 1,
                    studyfieldId: 2
                }
            ]);
        });
};