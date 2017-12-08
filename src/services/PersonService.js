const knex = require('../db/connection');

const personSchema = [
    "person.personId",
    "shibbolethId",
    "email",
    "firstname",
    "lastname",
    "title",
    "isRetired",
    "studentNumber",
    "address",
    "phone",
    "major",
]

export async function getAllPersons() {
    return await knex.select().from('person');
}

export async function getPersonsWithRole(roleId) {
    return knex.table('person')
        .join('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .select(personSchema);
}

export async function getPersonsWithRoleInStudyfield(roleId, studyfieldId) {
    return knex.table('person')
        .join('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .where('personWithRole.studyfieldId', studyfieldId)
        .select(personSchema);
}

export async function getLoggedPerson(req) {
    let user;
    if (req.session.user_id) {
        const userId = req.session.user_id;
        user = getPersonById(userId);
    } else if (req.headers['uid']) {
        const shibbolethId = req.headers['uid'];
        user = getPersonByShibbolethId(shibbolethId);
    }
    return user;
}


export const getPersonById = (id) => {
    return knex.select().from('person').where('personId', id)
        .then(person => person)
        .catch(error => {
            throw error
        });
}

export const getPersonByShibbolethId = (shibbolethId) => {
    return knex.select().from('person').where('shibbolethId', shibbolethId);
}

export async function savePerson(personData) {
    return await knex('person')
        .returning('personId')
        .insert(personData)
        .then(personId => personId[0])
        .catch(error => {
            throw error
        });
}

export async function savePersonRole(personRoleData) {
    return await knex('personWithRole')
        .returning('personRoleId')
        .insert(personRoleData)
        .then(personRoleId => personRoleId[0])
        .catch(error => {
            throw error
        });
}

export async function updatePerson(personData) {
    return await knex('person')
        .returning('personId')
        .where('personId', '=', personData.personId)
        .update(personData)
        .then(personId => personId)
        .catch(error => {
            throw error
        });
}

export const getAgreementPersonsByAgreementId = (agreementId) => {
    //TODO: figure out why this returns duplicates without distinct
    return knex.distinct('person.firstname', 'person.lastname', 'personWithRole.personRoleId').select().from('agreementPerson')
        .leftJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('agreementId', agreementId)
        .then(persons => {
            return persons;
        });
}

export const getAgreementPersonsByPersonRoleId = (personRoleId) => {
    return knex.select().from('agreementPerson')
        .where('personRoleId', personRoleId)
        .then(persons => {
            return persons;
        });
}
