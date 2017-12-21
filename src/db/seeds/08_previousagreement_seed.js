const previousAgreements = require('../../mockdata/MockPrevAgreements')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('previousagreements').del()
    .then(function () {
      return knex('previousagreements').insert(previousAgreements);
    });
};
