exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('role').del()
        .then(function () {
            // Inserts seed entries
            return knex('role').insert([
                {
                    roleId: 1,
                    name: 'supervisor'
                },
                {
                    roleId: 2,
                    name: 'grader'
                },
                {
                    roleId: 3,
                    name: 'author'
                },
                {
                    roleId: 4,
                    name: 'resp_professor'
                },
                {
                    roleId: 5,
                    name: 'other'
                }
            ]);
        });
};