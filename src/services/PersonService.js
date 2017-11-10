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
    return await knex('personRoleField')
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
        .then(personId => personId)
        .catch(err => err);
}

export const getPersonById = (id) => {
    return knex.select().from('person').where('personId', id)
        .then(person => person)
        .catch(err => err);
}

export const getAgreementPersonsByAgreementId = (id) => {
    return knex.select().from('agreementPerson')
        .join('role', 'agreementPerson.roleId', '=', 'role.roleId')
        .where('agreementId', id)
        .then(persons => {
            return persons;
        });
}
