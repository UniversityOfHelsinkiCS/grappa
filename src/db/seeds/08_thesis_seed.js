const theses = require('../../mockdata/MockTheses')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('thesis').del()
    // Inserts seed entries
    return knex('thesis').insert(theses)
}
