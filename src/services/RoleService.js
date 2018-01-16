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

export async function deletePersonRole(personRoleId) {
    return knex('personWithRole')
        .where('personRoleId', '=', personRoleId)
        .del()
        .then(() => personRoleId)
        .catch(err => Promise.reject(err));
}

export async function getPersonRole(personId, programmeId, roleName) {
    return knex.select().from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .where('role.name', roleName)
        .where('personWithRole.programmeId', programmeId)
        .where('personWithRole.personId', personId)
        .first();
}

export async function updateVisitorRoleStudyfields(personId, programmeIds) {
    const visitorRoleId = 7;

    const visitorRoles = await knex('personWithRole')
        .select()
        .where('personId', personId)
        .where('roleId', visitorRoleId);

    const rolesToDelete = visitorRoles
        .filter(role => !programmeIds.includes(role.programmeId))
        .map(role => role.programmeId)
        .map(programmeId =>
            knex('personWithRole')
                .delete()
                .where('personId', personId)
                .where('programmeId', programmeId)
        );
    const rolesToAdd = programmeIds
        .filter(role => !programmeIds.includes(role.programmeId))
        .map(programmeId =>
            knex('personWithRole').insert({ personId, programmeId, roleId: visitorRoleId })
        );

    return Promise.all([...rolesToDelete, ...rolesToAdd]);
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
    'personWithRole.programmeId',
    'role.name',
    'agreementPerson.agreementId',
    'agreementPerson.statement'
];

export async function getRolesForAllPersons() {
    return knex.select(roleSchema).from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
}

export async function getRoleForPersonWithRole(personRoleId) {
    return knex.select(roleSchema).from('personWithRole')
        .where('personWithRole.personRoleId', personRoleId)
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
        .first()
}
