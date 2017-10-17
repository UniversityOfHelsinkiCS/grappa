exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('faculty').del()
      .then(function () {
          // Inserts seed entries
          return knex('faculty').insert([
              {
                  facultyId: 1,
                  name: 'Faculty 1'
              },
              {
                  facultyId: 2,
                  name: 'Faculty 2'
              },
              {
                  facultyId: 3,
                  name: 'Faculty 3'
              }
          ]);
      });
};
