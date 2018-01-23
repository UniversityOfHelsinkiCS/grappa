const agreementPersons = require('../../mockdata/MockAgreementPersons')

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreementPerson').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreementPerson').insert(agreementPersons);
        });
};
