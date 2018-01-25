const studyfields = require('../../mockdata/MockStudyfields')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('previousagreements').del() // Foreign key violation
    await knex('agreementPerson').del() // Foreign key violation
    await knex('attachment').del() // Foreign key violation
    await knex('agreement').del() // Foreign key violation
    await knex('studyfield').del()
    // Inserts seed entries
    return knex('studyfield').insert(studyfields);
};
