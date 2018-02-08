const roles = require('../../mockdata/MockRoles')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('role').del()
        .then(() =>
            // Inserts seed entries
            knex('role').insert(roles)
        );
};
