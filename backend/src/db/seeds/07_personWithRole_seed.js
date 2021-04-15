const personWithRole = require('../../mockdata/MockPersonRoleFields')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('personWithRole').del()
    // Inserts seed entries
    await knex('personWithRole').insert(personWithRole)
    return knex.raw('ALTER SEQUENCE "personWithRole_personRoleId_seq" RESTART WITH 50')
}
