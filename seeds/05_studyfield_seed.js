exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('studyfield').del()
        .then(function () {
            // Inserts seed entries
            return knex('studyfield').insert([
                {
                    studyfieldId: 1,
                    facultyId: 1,
                    name: 'Studyfield 1'
                },
                {
                    studyfieldId: 2,
                    facultyId: 2,
                    name: 'Studyfield 2'
                },
                {
                    studyfieldId: 3,
                    facultyId: 2,
                    name: 'Studyfield 3'
                },
                {
                    studyfieldId: 4,
                    facultyId: 3,
                    name: 'Studyfield 4'
                }
            ]);
        });
};