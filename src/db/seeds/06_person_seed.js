const persons = require('../../mockdata/MockPersons')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('person').del()
    // Inserts seed entries
    await knex('person').insert(persons)
    return knex.raw('ALTER SEQUENCE "person_personId_seq" RESTART WITH 50')
}
