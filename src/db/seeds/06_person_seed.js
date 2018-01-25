const persons = require('../../mockdata/MockPersons')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('person').del()
      .then(function () {
          // Inserts seed entries
          return knex('person').insert(persons);
      });
};
