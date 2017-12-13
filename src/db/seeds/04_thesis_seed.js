exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('thesis').del()
        .then(function () {
            // Inserts seed entries
            return knex('thesis').insert([
                {
                    thesisId: 1,
                    title: 'Annin Grady',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 1
                },
                {
                    thesisId: 2,
                    title: 'Hieno Gradu',
                    urkund: 'http://',
                    grade: 1,
                    graderEval: 'Tarkastajien esittely',
                    userId: 2
                },
                {
                    thesisId: 3,
                    title: 'Amazing Thesis',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 5
                }
            ]);
        });
};
