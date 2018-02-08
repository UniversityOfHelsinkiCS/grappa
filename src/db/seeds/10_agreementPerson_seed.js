const agreementPersons = require('../../mockdata/MockAgreementPersons')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('agreementPerson').del()
        .then(() =>
            // Inserts seed entries
            knex('agreementPerson').insert(agreementPersons)
        );
};
