const studyfields = require('../../mockdata/MockStudyfields')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('studyfield').del()
    // Inserts seed entries
    await knex('studyfield').insert(studyfields)
    return knex.raw('ALTER SEQUENCE "studyfield_studyfieldId_seq" RESTART WITH 80')
}
