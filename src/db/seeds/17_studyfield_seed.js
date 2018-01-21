const studyfields = require('../../mockdata/MockStudyfields')

exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('studyfield').del()
        .then(() => {
            // Inserts seed entries
            return knex('studyfield').insert(studyfields);
        });
};