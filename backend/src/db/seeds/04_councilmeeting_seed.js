const councilmeetings = require('../../mockdata/MockCouncilmeetings')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('councilmeeting').del()
    // Inserts seed entries
    await knex('councilmeeting').insert(councilmeetings)
    return knex.raw('ALTER SEQUENCE "councilmeeting_councilmeetingId_seq" RESTART WITH 50')
}
