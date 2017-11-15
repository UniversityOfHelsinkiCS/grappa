exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('personWithRole').del()
        .then(function () {
            // Inserts seed entries
            return knex('personWithRole').insert([
                {
                    personRoleId: 1,
                    personId: 1,
                    roleId: 1,
                    studyfieldId: 1,
                },
                {
                    personRoleId: 2,
                    personId: 2,
                    roleId: 1,
                    studyfieldId: 2
                },
                {
                    personRoleId: 3,
                    personId: 3,
                    roleId: 1,
                    studyfieldId: 1
                }
            ]);
        });
};