exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('personWithRole').del()
        .then(function () {
            // Inserts seed entries
            return knex('personWithRole').insert([
                {
                    //olli ohjaaja
                    personRoleId: 1,
                    personId: 1,
                    roleId: 1,
                    studyfieldId: 1,
                },
                {
                    //venla vastuuproffa
                    personRoleId: 2,
                    personId: 2,
                    roleId: 4,
                    studyfieldId: 2
                },
                {
                    //anna puu muu ohjaaja
                    personRoleId: 3,
                    personId: 3,
                    roleId: 1,
                    studyfieldId: 1
                },
                {
                    //erkki eläkeläinen
                    personRoleId: 4,
                    personId: 4,
                    roleId: 5,
                    studyfieldId: 1
                },
                {
                    //olivia opiskelija
                    personRoleId: 5,
                    personId: 5,
                    roleId: 3,
                    studyfieldId: 2
                }
            ]);
        });
};