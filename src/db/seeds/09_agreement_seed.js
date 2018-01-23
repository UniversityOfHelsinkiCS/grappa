const agreements = require('../../mockdata/MockAgreements')

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('agreement').del()
        .then(function () {
            // Inserts seed entries
            return knex('agreement').insert(agreements);
        });
};
