const knex = require('../db/connection');

//Role

export async function getRoles() {
    return knex.select().from('role');
}

export async function getRoleId(roleName) {
    const role = await knex.select().from('role').where('name', roleName).first();
    return role.roleId;
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

//PersonWithRole

export async function getPersonRoles(personId) {
    return knex.select().from('personWithRole').where('personId', personId);
}

export async function getPersonRoleWithId(personRoleId) {
    return knex.select().from('personWithRole').where('personRoleId', personRoleId).first();
}

export async function savePersonRole(personWithRole) {
    return knex('personWithRole').returning('personRoleId')
        .insert(personWithRole).then(personRoleIds =>
            knex.select().from('personWithRole').where('personRoleId', personRoleIds[0]).first()
        );
}

export async function getPersonRole(personId, studyfieldId, roleName) {
    return knex.select().from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .where('role.name', roleName)
        .where('personWithRole.studyfieldId', studyfieldId)
        .where('personWithRole.personId', personId)
        .first();
}

export async function updateVisitorRoleStudyfield(personId, studyfieldId) {
    const visitorRoleId = 7;

    return knex('personWithRole').returning('personRoleId')
        .where('personId', personId)
        .where('roleId', visitorRoleId)
        .update({ studyfieldId });
}

//AgreementPerson

export async function linkAgreementAndPersonRole(agreementId, personRoleId) {
    const agreementPerson = {
        agreementId,
        personRoleId,
    }
    return knex('agreementPerson').returning('agreementPersonId')
        .insert(agreementPerson).then(agreementPersonIds =>
            knex.select().from('agreementPerson').where('agreementPersonId', agreementPersonIds[0]).first()
        );
}

export async function unlinkAgreementAndPersonRole(agreementId, personRoleId) {
    return knex('agreementPerson')
        .where('agreementId', '=', agreementId)
        .where('personRoleId', '=', personRoleId)
        .del()
}

export const getAgreementPersonsByAgreementId = (agreementId) => {
    return knex.select().from('agreementPerson')
        .leftJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('agreementId', agreementId)
}

//Straight to frontend

const roleSchema = [
    'personWithRole.personRoleId',
    'personWithRole.personId',
    'personWithRole.studyfieldId',
    'role.name',
    'agreementPerson.agreementId',
    'agreementPerson.statement'
];

export async function getRolesForAllPersons() {
    return knex.select(roleSchema).from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
}