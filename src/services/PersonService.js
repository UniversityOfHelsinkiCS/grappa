const knex = require('../db/connection').getKnex()
const roleService = require('./RoleService')
const PersonWithRole = require('../db/models/person_with_role')
const RoleRequest = require('../db/models/role_request')
const Person = require('../db/models/person')

const personSchema = [
    'person.personId',
    'shibbolethId',
    'email',
    'firstname',
    'lastname',
    'isRetired',
    'phone'
]

export function getAllPersons() {
    return knex.select(personSchema).from('person')
}

// TODO: replace this completely with getPersonsForRole
export function getPersonsWithRole(roleId) {
    return knex.table('person').distinct('person.personId')
        .innerJoin('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .select(personSchema)
}

export const getPersonsForRole = async (role) => {
    const roleId = await roleService.getRoleId(role)
    return PersonWithRole
        .query({ where: { roleId }, columns: ['personId', 'roleId', 'programmeId'] })
        .fetchAll({ withRelated: [
            { person: (qb) => {
                qb.column('personId', 'firstname', 'lastname', 'email', 'isRetired')
            } },
            'programme']
        })
}

export function getPersonsWithRoleInStudyfield(roleId, programmeId) {
    return knex.table('person').distinct('person.personId')
        .join('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .where('personWithRole.programmeId', programmeId)
        .select(personSchema)
}

export function getProgrammePersons(programmeId) {
    return knex('person')
        .join('personWithRole', 'person.personId', 'personWithRole.personId')
        .join('role', 'personWithRole.roleId', 'role.roleId')
        .where('programmeId', programmeId)
        .whereIn('role.name', ['manager', 'print_person', 'resp_professor'])
}

export async function getLoggedPerson(req) {
    if (req.decodedToken) {
        const { userId } = req.decodedToken
        return getPersonByShibbolethId(userId)
    }

    return null
}

export const getPersonById = id => knex.select().from('person').where('personId', id).first()

export const getPersonByShibbolethId = shibbolethId =>
    knex.select().from('person').where('shibbolethId', shibbolethId).first()

export async function savePerson(personData) {
    // If already exists then return that person
    let person = await knex.select(personSchema).from('person').where({
        email: personData.email,
        firstname: personData.firstname,
        lastname: personData.lastname
    }).first()
    if (!person) {
        const personIds = await knex('person')
            .returning('personId')
            .insert(personData)
        const personId = personIds[0]
        person = await getPersonById(personId)
    }
    return person
}

export const updatePerson = async (personData) => {
    const personId = await knex('person')
        .returning('personId')
        .where('personId', '=', personData.personId)
        .update(personData)
        .then(personId => personId[0])
        .catch((error) => {
            throw error
        })
    return getPersonById(personId)
}

export const getPersonsWithAgreementPerson = agreementpersonId => knex.select(personSchema).from('person')
    .innerJoin('agreement', 'agreement.authorId', '=', 'person.personId')
    .innerJoin('agreementPerson', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
    .innerJoin('personWithRole', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
    .where('personWithRole.personId', agreementpersonId)

export const getPersonsWithAgreementInStudyfield = programmeId => knex.select(personSchema).from('person')
    .innerJoin('agreement', 'agreement.authorId', '=', 'person.personId')
    .innerJoin('agreementPerson', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
    .innerJoin('personWithRole', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
    .where('personWithRole.programmeId', programmeId)

export const createOutsidePerson = async (firstname, lastname, email, programmes, roleId) => {
    try {
        const person = await savePerson({ firstname, lastname, email })
        const personRoles = await Promise.all(programmes
            .map(programmeId =>
                roleService.savePersonRole({
                    roleId,
                    personId: person.personId,
                    programmeId
                })
            ))
        return { person, personRoles }
    } catch (error) {
        // console.log(error)
        return { errorMsg: 'Failed to create outside person with roles', error }
    }
}

export const getPersonsWithRoleForProgramme = async (roleId, programmeId) => (
    PersonWithRole
        .query({ where: { roleId, programmeId }, columns: ['personId', 'roleId', 'programmeId'], distinct: 'personId' })
        .fetchAll({ withRelated: [
            { person: (qb) => {
                qb.column('personId', 'firstname', 'lastname', 'email', 'isRetired')
            } },
            'programme']
        })
)

export const getPendingPersonsWithRole = async (roleId, programmeId) => (
    RoleRequest
        .query({ where: { roleId, programmeId, handled: false }, distinct: ['personId', 'roleRequestId'] })
        .fetchAll({ withRelated: [
            { person: (qb) => {
                qb.column('personId', 'firstname', 'lastname', 'email', 'isRetired')
            } },
            'programme']
        })
)

export const getPersonByEmail = async email => Person.where({ email }).fetch()

export const updateNonRegisteredPerson = async (person, studentNumber, shibbolethId) => (
    person.set({ studentNumber, shibbolethId }).save()
)
