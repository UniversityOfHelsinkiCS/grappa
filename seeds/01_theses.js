
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('thesis').del()
    .then(function () {
      // Inserts seed entries
      return knex('thesis').insert([
        {
          id: 1,
          authorFirstname: 'Anni',
          authorLastname: 'Puurunen',
          authorEmail: 'anni.puurunen@gmail.com',
          title: 'Annin Grady',
          urkund: 'http://',
          grade: 4,
          graderEval: 'Tarkastajien esittely',
          studyFieldId: 1,
          userId: 1
        },
        {
          id: 2,
          authorFirstname: 'Etunimi',
          authorLastname: 'Sukunimi',
          authorEmail: 'etu.suku@gmail.com',
          title: 'Hieno Gradu',
          urkund: 'http://',
          grade: 1,
          graderEval: 'Tarkastajien esittely',
          studyFieldId: 2,
          userId: 2
        },
        {
          id: 3,
          authorFirstname: 'Firstname',
          authorLastname: 'Lastname',
          authorEmail: 'first.last@gmail.com',
          title: 'Amazing Thesis',
          urkund: 'http://',
          grade: 4,
          graderEval: 'Tarkastajien esittely',
          studyFieldId: 2,
          userId: 5
        }
      ]);
    });
};
