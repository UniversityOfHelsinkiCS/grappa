const persons = require('../../mockdata/MockPersons')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('person').del()
    // Inserts seed entries
    return knex('person').insert(persons)
};
