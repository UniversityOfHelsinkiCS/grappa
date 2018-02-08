const previousAgreements = require('../../mockdata/MockPrevAgreements')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('previousagreements').del()
        .then(() => knex('previousagreements').insert(previousAgreements));
};
