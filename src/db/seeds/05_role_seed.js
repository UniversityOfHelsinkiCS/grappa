const roles = require('../../mockdata/MockRoles')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('role').del()
    // Inserts seed entries
    return knex('role').insert(roles)
};
