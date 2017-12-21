const knex = require('../db/connection');

const personSchema = [
    "person.personId",
    "shibbolethId",
    "email",
    "firstname",
    "lastname",
    "person.title",
    "isRetired",
    "studentNumber",
    "address",
    "phone",
    "major",
]

export async function getAllPersons() {
    return knex.select(personSchema).from('person');
}

export async function getPersonsWithRole(roleId) {
    return knex.table('person').distinct('person.personId')
        .innerJoin('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .select(personSchema);
}

export async function getPersonsWithRoleInStudyfield(roleId, studyfieldId) {
    return knex.table('person').distinct('person.personId')
        .join('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', roleId)
        .where('personWithRole.studyfieldId', studyfieldId)
        .select(personSchema);
}

export async function getLoggedPerson(req) {
    let user;
    if (req.session.user_id) {
        const userId = req.session.user_id;
        user = await getPersonById(userId);
    } else if (req.headers['uid']) {
        const shibbolethId = req.headers['uid'];
        user = await getPersonByShibbolethId(shibbolethId);
    }
    return user[0];
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
    //If already exists then return that person
    let person = await knex.select(personSchema).from('person').where({
        email: personData.email,
        firstname: personData.firstname,
        lastname: personData.lastname,
    }).first();
    if (!person) {
        const personIds = await knex('person')
            .returning('personId')
            .insert(personData)
        const personId = personIds[0]
        person = knex.select(personSchema).from('person').where('personId', personId).first()
    }
    return person;
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

export const getPersonsWithAgreementPerson = (agreementpersonId) => {
    return knex.select(personSchema).from('person')
        .innerJoin('agreement', 'agreement.authorId', '=', 'person.personId')
        .innerJoin('agreementPerson', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
        .innerJoin('personWithRole', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
        .where('personWithRole.personId', agreementpersonId)
}

export const getPersonsWithAgreementInStudyfield = (studyfieldId) => {
    return knex.select(personSchema).from('person')
        .innerJoin('agreement', 'agreement.authorId', '=', 'person.personId')
        .innerJoin('agreementPerson', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
        .innerJoin('personWithRole', 'personWithRole.personRoleId', '=', 'agreementPerson.personRoleId')
        .where('personWithRole.studyfieldId', studyfieldId)
}

export const getPersonsAsAgreementPersonInStudyfield = (studyfieldId) => {
    return knex.select(personSchema).from('person')
        .innerJoin('personWithRole', 'personWithRole.personId', '=', 'person.personId')
        .where('personWithRole.studyfieldId', studyfieldId)
}

export const getPersonByPersonRoleId = (personRoleId) => {
    return knex.select().from('person')
        .innerJoin('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('personRoleId', personRoleId)
        .then(persons => {
            return persons[0];
        })
        .catch(error => {
            console.log(error);
            throw error;
        });
}

export const getAgreementPersonsByPersonRoleId = (personRoleId) => {
    return knex.select().from('agreementPerson')
        .where('personRoleId', personRoleId)
        .then(persons => {
            return persons;
        });
}
