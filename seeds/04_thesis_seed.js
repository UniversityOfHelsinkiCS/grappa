exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('thesis').del()
        .then(function () {
            // Inserts seed entries
            return knex('thesis').insert([
                {
                    thesisId: 1,
                    thesisTitle: 'Annin Grady',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 1
                },
                {
                    thesisId: 2,
                    thesisTitle: 'Hieno Gradu',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 1,
                    graderEval: 'Tarkastajien esittely',
                    userId: 2
                },
                {
                    thesisId: 3,
                    thesisTitle: 'Amazing Thesis',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 5
                }
            ]);
        });
};