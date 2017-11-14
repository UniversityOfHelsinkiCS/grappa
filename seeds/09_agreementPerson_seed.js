exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreementPerson').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreementPerson').insert([
                {
                    agreementId: 1,
                    personRoleId: 1,
                    approverId: 2,
                    approved: true,
                    statement: 'This supervisor is approved'
                },
                {
                    agreementId: 2,
                    personRoleId: 2,
                    approverId: 1,
                    approved: false,
                    statement: 'This supervisor has not been approved'
                },
                {
                    agreementId: 1,
                    personRoleId: 3,
                    approverId: 2,
                    approved: true,
                    statement: ''
                }
            ]);
        });
};
