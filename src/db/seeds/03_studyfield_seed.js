const studyfields = require('../../mockdata/MockStudyfields')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('studyfield').del();
    // Inserts seed entries
    return knex('studyfield').insert(studyfields);
};
