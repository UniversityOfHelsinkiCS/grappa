require('babel-polyfill');
const knex = require('../../connection');

export async function savePerson(personData) {
    return await knex('person')
        .returning('personId')
        .insert(personData)
        .then(personId => personId[0])
        .catch(err => err);
}

export async function savePersonRole(personRoleData) {
    return await knex('personWithRole')
        .returning('personRoleId')
        .insert(personRoleData)
        .then(personRoleId => personRoleId[0])
        .catch(err => err);
}

export async function updatePerson(personData) {
    return await knex('person')
        .returning('personId')
        .where('personId', '=', personData.personId)
        .update(personData)
<<<<<<< HEAD
        .then(personId => personId[0])
=======
        .then(personId => personId)
>>>>>>> 20004689e306828d8008b3d7c027ca27417198a9
        .catch(err => err);
}

export const getPersonById = (id) => {
    return knex.select().from('person').where('personId', id)
        .then(person => person)
        .catch(err => err);
}

export const getAgreementPersonsByAgreementId = (id) => {
    //TODO: figure out why this returns duplicates without distinct
    return knex.distinct('person.firstname', 'person.lastname', 'personWithRole.personRoleId').select().from('agreementPerson')
        .leftJoin('personWithRole', 'agreementPerson.roleId', '=', 'personWithRole.roleId')
        .leftJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('agreementId', id)
        .then(persons => {
            return persons;
        });
}
