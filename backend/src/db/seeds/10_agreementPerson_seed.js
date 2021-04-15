const agreementPersons = require('../../mockdata/MockAgreementPersons')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreementPerson').del()
    // Inserts seed entries
    return knex('agreementPerson').insert(agreementPersons)
    // return knex.raw('ALTER SEQUENCE "agreementPerson_agreementPersonId_seq" RESTART WITH 50')
}
