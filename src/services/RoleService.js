const knex = require('../db/connection');

export async function getRoles() {
    return knex.select().from('role');
}

export async function getPersonRoles(personId) {
    return knex.select().from('personWithRole').where('personId', personId);
}

export async function getRoleId(roleName) {
    const role = await knex.select().from('role').where('name', roleName).first();
    return role.roleId;
}

const roleSchema = [
    'personWithRole.personRoleId',
    'personWithRole.personId',
    'personWithRole.studyfieldId',
    'role.name',
    'agreementPerson.agreementId',
    'agreementPerson.statement',
]

export async function getRolesForAllPersons() {
    return knex.select(roleSchema).from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
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