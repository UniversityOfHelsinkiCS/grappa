import { getLoggedPerson } from './PersonService'

const knex = require('../db/connection').getKnex()
const programmeService = require('./ProgrammeService')

// Role

export async function getRoles() {
    return knex.select().from('role')
}

export async function getAvailableRoles() {
    return knex.select().from('role').whereNot('roleId', 1)
}

export async function getRoleId(roleName) {
    const role = await knex.select().from('role').where('name', roleName).first()
    return role.roleId
}

export async function saveRole(roleName) {
    return knex('role')
        .returning('roleId')
        .insert({ name: roleName })
        .then(roleId => roleId[0])
        .catch((error) => {
            throw error
        })
}

// PersonWithRole

export async function getPersonRoles(personId) {
    return knex.select().from('personWithRole').where('personId', personId)
}

export async function getPersonRoleWithId(personRoleId) {
    return knex.select().from('personWithRole').where('personRoleId', personRoleId).first()
}

export async function savePersonRole(personWithRole) {
    return knex('personWithRole').returning('personRoleId')
        .insert(personWithRole).then(personRoleIds =>
            knex.select().from('personWithRole').where('personRoleId', personRoleIds[0]).first()
        )
}

export async function deletePersonRole(personRoleId) {
    return knex('personWithRole')
        .where('personRoleId', '=', personRoleId)
        .del()
        .then(() => personRoleId)
        .catch(err => Promise.reject(err))
}

export async function getPersonRole(personId, programmeId, roleName) {
    return knex.select().from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .where('role.name', roleName)
        .where('personWithRole.programmeId', programmeId)
        .where('personWithRole.personId', personId)
        .first()
}

// AgreementPerson

export async function linkAgreementAndPersonRole(agreementId, personRoleId, trx) {
    return knex('agreementPerson').insert({ agreementId, personRoleId }).transacting(trx)
}

export async function unlinkAgreementAndPersonRole(agreementId, personRoleId, trx) {
    return knex('agreementPerson')
        .where('agreementId', '=', agreementId)
        .where('personRoleId', '=', personRoleId)
        .del()
        .transacting(trx)
}

export const getAgreementPersonsByAgreementId = agreementId => knex.select().from('agreementPerson')
    .leftJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
    .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
    .where('agreementId', agreementId)

export const updateAgreementPerson = (agreementId, personRoleId, agreementPerson) => knex('agreementPerson')
    .where('agreementId', agreementId)
    .where('personRoleId', personRoleId)
    .update(agreementPerson)

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
]

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
        .first()
}

export const getUsersRoles = async (user) => {
    const roleToId = await getRoles()
    const programmeToId = await programmeService.getAllProgrammes()
    const personRoles = await getPersonRoles(user.personId)
    return personRoles.map(role => ({
        programme: programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId),
        role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
    }))
}

export async function isUserAdmin(user) {
    return knex.select()
        .from('personWithRole')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('personId', user.personId)
        .where('name', 'admin')
        .then(res => res.length > 0)
}

export async function isUserAdminOrManager(user) {
    return knex.select()
        .from('personWithRole')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('personId', user.personId)
        .where('name', 'admin')
        .orWhere('name', 'manager')
        .then(res => res.length > 0)
}

export async function checkUserIsAdminOrManager(req) {
    if (!await isUserAdminOrManager(await getLoggedPerson(req))) {
        throw new Error('User is not admin or manager')
    }
}
