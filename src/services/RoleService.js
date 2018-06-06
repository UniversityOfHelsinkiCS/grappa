import { getLoggedPerson } from './PersonService'
import RoleRequest from '../db/models/role_request'
import PersonWithRole from '../db/models/person_with_role'
import Role from '../db/models/role'
import bookshelf from '../db/bookshelf'

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

export const getRoleById = async id => Role.where('roleId', id).fetch()

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

export const getRolesForAllPersons = async () =>
    knex.select(roleSchema).from('personWithRole')
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')

// May return multiple, since one personRole can have multiple agreementPersons via agreementIds
export const getRolesForPersonWithRole = async personRoleId =>
    knex.select(roleSchema).from('personWithRole')
        .where('personWithRole.personRoleId', personRoleId)
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')

// Will return single
export const getRoleWithAgreementIdAndPersonRole = async (agreementId, personRoleId) =>
    knex.select(roleSchema).from('personWithRole')
        .where('personWithRole.personRoleId', personRoleId)
        .where('agreementPerson.agreementId', agreementId)
        .innerJoin('role', 'personWithRole.roleId', '=', 'role.roleId')
        .leftJoin('agreementPerson', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
        .first()


export const getUsersRoles = async (user) => {
    const roleToId = await getRoles()
    const programmeToId = await programmeService.getAllProgrammes()
    const personRoles = await getPersonRoles(user.personId)
    return personRoles.map(role => ({
        programme: programmeToId.find(programmeIdPair => programmeIdPair.programmeId === role.programmeId),
        role: roleToId.find(roleIdPair => roleIdPair.roleId === role.roleId)
    }))
}

export const isUserAdmin = async user =>
    knex.select()
        .from('personWithRole')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('personId', user.personId)
        .where('name', 'admin')
        .then(res => res.length > 0)


export const isUserAdminOrManager = async user =>
    knex.select()
        .from('personWithRole')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('personId', user.personId)
        .andWhere(function () { this.where('name', 'admin').orWhere('name', 'manager') })
        .then(res => res.length > 0)


export const doesUserHaveRole = async (user, roles) =>
    knex.select()
        .from('personWithRole')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('personId', user.personId)
        .andWhere(function () { this.whereIn('name', roles) })
        .then(res => res.length > 0)


export const checkUserIsAdminOrManager = async (req) => {
    if (!await isUserAdminOrManager(await getLoggedPerson(req))) {
        throw new Error('User is not admin or manager')
    }
}

export const checkUserHasRightToPrint = async (req) => {
    const user = await getLoggedPerson(req)
    const printerRoles = ['manager', 'admin', 'print_person', 'resp_prof', 'admin']

    if (await doesUserHaveRole(user, printerRoles)) {
        return true
    }
    return false
}

export const submitRoleRequest = async (personId, roleId, programmeId) => {
    const request = await RoleRequest.forge({
        personId,
        roleId,
        programmeId,
        handled: false
    }).save()
    return request
}

export const findUnhandledRoleRequests = async () => (
    RoleRequest.where('handled', false).fetchAll({
        withRelated: [{
            person: (qb) => {
                qb.column('personId', 'firstname', 'lastname', 'email')
            }
        }, 'programme', 'role']
    })
)

export const grantRoleRequest = async (roleRequestId, granted, granter) => {
    const roleRequest = await RoleRequest.where('roleRequestId', roleRequestId).fetch()
    await bookshelf.transaction(async (t) => {
        await roleRequest.save({ granted, handled: true, granterId: granter.personId }, { transacting: t })
        if (granted === true) {
            const personId = roleRequest.get('personId')
            const roleId = roleRequest.get('roleId')
            const programmeId = roleRequest.get('programmeId')
            const agreementId = roleRequest.get('agreementId')
            const personRole = await PersonWithRole.forge({ personId, roleId, programmeId })
                .save(null, { transacting: t })
            if (agreementId) {
                await linkAgreementAndPersonRole(agreementId, personRole.get('personRoleId'), t)
            }
        }
        // if the request is rejected and the person doesn't have any roles or shibboId,
        // then the person should be removed from database alltogether.
        return roleRequest
    })
    return roleRequest
}

export const linkRoleRequestToAgreement = async (agreementId, roleRequestId, trx) => (
    // why does this work?
    knex('roleRequest').where({ roleRequestId }).update({ agreementId }).transacting(trx)
    // and this does not? Should use the same transaction function
    // RoleRequest.forge({ roleRequestId }).save({ agreementId }, { patch: true }, { transacting: trx })
)
