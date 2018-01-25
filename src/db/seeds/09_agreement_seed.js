const agreements = require('../../mockdata/MockAgreements')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('previousagreements').del() // Foreign key violation
    await knex('agreementPerson').del() // Foreign key violation
    await knex('attachment').del() // Foreign key violation
    await knex('agreement').del()
    // Inserts seed entries
    return knex('agreement').insert(agreements);
};
