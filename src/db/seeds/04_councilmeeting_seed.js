const councilmeetings = require('../../mockdata/MockCouncilmeetings');

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('councilmeeting').del()
        .then(function () {
            // Inserts seed entries
            return knex('councilmeeting').insert(councilmeetings);
        });
};