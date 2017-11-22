exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('faculty').del()
      .then(function () {
          // Inserts seed entries
          return knex('faculty').insert([
              {
                  facultyId: 1,
                  name: 'Matemaattis-luonnontieteellinen tiedekunta'
              },
              {
                  facultyId: 2,
                  name: 'Oikeustieteellinen tiedekunta'
              },
              {
                  facultyId: 3,
                  name: 'Valtiotieteellinen tiedekunta'
              }
          ]);
      });
};
