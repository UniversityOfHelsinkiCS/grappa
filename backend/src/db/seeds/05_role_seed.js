const roles = require('../../mockdata/MockRoles')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('role').del()
    // Inserts seed entries
    await knex('role').insert(roles)
    return knex.raw('ALTER SEQUENCE "role_roleId_seq" RESTART WITH 50')
}
