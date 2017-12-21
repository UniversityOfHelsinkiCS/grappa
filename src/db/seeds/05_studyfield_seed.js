const studyfields = require('../../mockdata/MockStudyfields')

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('studyfield').del()
        .then(function () {
            // Inserts seed entries
            return knex('studyfield').insert(studyfields);
        });
};
