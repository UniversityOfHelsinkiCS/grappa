const programmes = require('../../mockdata/MockProgrammes')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('programme').del()
    await knex('programme').insert(programmes)
    return knex.raw('ALTER SEQUENCE "programme_programmeId_seq" RESTART WITH 50')
}
