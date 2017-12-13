exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('thesis').del()
        .then(function () {
            // Inserts seed entries
            return knex('thesis').insert([
                {
                    thesisId: 1,
                    title: 'Annin Grady',
                    startDate: '6.5.2005',
                    completionEta: '1.2.2006',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 1
                },
                {
                    thesisId: 2,
                    title: 'Hieno Gradu',
                    startDate: '1.1.2014',
                    completionEta: '5.8.2014',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 1,
                    graderEval: 'Tarkastajien esittely',
                    userId: 2
                },
                {
                    thesisId: 3,
                    title: 'Amazing Thesis',
                    startDate: '13.2.1999',
                    completionEta: '14.2.2000',
                    performancePlace: 'Hima',
                    urkund: 'http://',
                    grade: 4,
                    graderEval: 'Tarkastajien esittely',
                    userId: 5
                }
            ]);
        });
};
