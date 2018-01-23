exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('programme').del()
        .then(() => {
            // Inserts seed entries
            return knex('programme').insert([
                {
                    facultyId: 1,
                    name: 'Computer Science Masters programme'
                },
                {
                    facultyId: 1,
                    name: 'Data Science Masters programme'
                }
            ]);
        });
};
