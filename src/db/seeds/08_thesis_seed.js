const theses = require('../../mockdata/MockTheses')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('thesis').del()
    // Inserts seed entries
    await knex('thesis').insert(theses)
    return knex.raw('ALTER SEQUENCE "thesis_thesisId_seq" RESTART WITH 50')
}
