const knex = require('../db/connection').getKnex();
const programmeService = require('./ProgrammeService');

// Role

export async function getRoles() {
    return knex.select().from('role');
}

export async function getAvailableRoles() {
    return knex.select().from('role').whereNot('roleId', 1);
}

export async function getRoleId(roleName) {
    const role = await knex.select().from('role').where('name', roleName).first();
    return role.roleId;
}

export async function saveRole(roleName) {
    return knex('role')
        .returning('roleId')
        .insert({ name: roleName })
        .then(roleId => roleId[0])
        .catch((error) => {
            throw error
        });
}

// PersonWithRole

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

// AgreementPerson

export async function linkAgreementAndPersonRole(agreementId, personRoleId) {
    return knex('agreementPerson').insert({ agreementId, personRoleId });
}

export async function unlinkAgreementAndPersonRole(agreementId, personRoleId) {
    return knex('agreementPerson')
        .where('agreementId', '=', agreementId)
        .where('personRoleId', '=', personRoleId)
        .del()
}

export const getAgreementPersonsByAgreementId = agreementId => knex.select().from('agreementPerson')
    .leftJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
    .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
    .where('agreementId', agreementId);

export const updateAgreementPerson = (agreementId, personRoleId, agreementPerson) => knex('agreementPerson')
    .where('agreementId', agreementId)
    .where('personRoleId', personRoleId)
    .update(agreementPerson);

// Straight to frontend

const roleSchema = [
    'personWithRole.personRoleId',
    'personWithRole.personId',
    'personWithRole.programmeId',
    'role.name',
    'agreementPerson.agreementId',
    'agreementPerson.statement',
    'agreementPerson.approved',
    'agreementPerson.approverId',
    'agreementPerson.approvalDate'
];

export async function getRolesForAllPersons() {
    return knex.select(roleSchema).from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
}

// May return multiple, since one personRole can have multiple agreementPersons via agreementIds
export async function getRolesForPersonWithRole(personRoleId) {
    return knex.select(roleSchema).from('personWithRole')
        .where('personWithRole.personRoleId', personRoleId)
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
}

// Will return single
export async function getRoleWithAgreementIdAndPersonRole(agreementId, personRoleId) {
    return knex.select(roleSchema).from('personWithRole')
        .where('personWithRole.personRoleId', personRoleId)
        .where('agreementPerson.agreementId', agreementId)
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
        .first();
}

export const getUsersRoles = async (user) => {
    const roleToId = await getRoles();
    const programmeToId = await programmeService.getAllProgrammes();
    const personRoles = await getPersonRoles(user.personId);
    return personRoles.map(role => ({
        programme: programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId),
        role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
    }))
};
