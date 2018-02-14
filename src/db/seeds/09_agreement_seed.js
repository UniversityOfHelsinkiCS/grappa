const agreements = require('../../mockdata/MockAgreements')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('agreement').del()
    // Inserts seed entries
    return knex('agreement').insert(agreements)
}
