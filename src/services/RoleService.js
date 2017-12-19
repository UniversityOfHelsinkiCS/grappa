const knex = require('../db/connection');

export async function getRoles() {
    return knex.select().from('role');
}

export async function getPersonRoles(personId) {
    return knex.select().from('personWithRole').where('personId', personId);
}

export async function getRoleId(roleName) {
    const roleData = await knex.select().from('role').where('name', roleName);
    return roleData[0].roleId;
}

export async function saveRole(roleName) {
    return await knex('role')
        .returning('roleId')
        .insert({ name: roleName })
        .then(roleId => roleId[0])
        .catch(error => {
            throw error
        });
}