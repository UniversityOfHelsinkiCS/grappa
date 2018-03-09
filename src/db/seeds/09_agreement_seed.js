const agreements = require('../../mockdata/MockAgreements')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreement').del()
    // Inserts seed entries
    await knex('agreement').insert(agreements)
    return knex.raw('ALTER SEQUENCE "agreement_agreementId_seq" RESTART WITH 50')
}
