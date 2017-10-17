exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreementPerson').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreementPerson').insert([
                {
                    personRoleId: 1,
                    roleId: 1,
                    approved: true,
                    statement: 'This supervisor is approved'
                },
                {
                    personRoleId: 2,
                    roleId: 1,
                    approved: false,
                    statement: 'This supervisor has not been approved'
                },
                {
                    personRoleId: 3,
                    roleId: 1,
                    approved: true,
                    statement: ''
                }
            ]);
        });
};
