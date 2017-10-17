exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('person').del()
      .then(function () {
          // Inserts seed entries
          return knex('person').insert([
              {
                  personId: 1,
                  shibbolethId: 'zippoletid1',
                  email: 'first.last@gmail.com',
                  title: 'Dr.',
                  firstname: 'Supervisor',
                  lastname: 'Lastname',
                  isRetired: false,
              },
              {
                  personId: 2,
                  shibbolethId: 'zippoletid2',
                  email: 'olavi.uusivirta@gmail.com',
                  title: 'Prof.',
                  firstname: 'Olavi',
                  lastname: 'Uusivirta',
                  isRetired: false,
              },
              {
                  personId: 3,
                  shibbolethId: 'zippoletid3',
                  email: 'anna.puu@hotmail.com',
                  title: 'Other',
                  firstname: 'Anna',
                  lastname: 'Puu',
                  isRetired: false,
              },
              {
                  personId: 4,
                  shibbolethId: 'zippoletid',
                  email: 'retired.person@gmail.com',
                  title: 'Ms',
                  firstname: 'Retired',
                  lastname: 'Person',
                  isRetired: true,
              }
          ]);
      });
};
