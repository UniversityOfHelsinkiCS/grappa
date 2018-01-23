exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('studyfield').del()
        .then(() => {
            // Inserts seed entries
            return knex('studyfield').insert([
                {
                    programmeId: 1,
                    name: 'Software systems'
                },
                {
                    programmeId: 1,
                    name: 'Algorithms and machine learning'
                },
                {
                    programmeId: 1,
                    name: 'Networking'
                },
                {
                    programmeId: 1,
                    name: 'Distributed systems'
                }
            ]);
        });
};
