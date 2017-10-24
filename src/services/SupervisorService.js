require('babel-polyfill');
const knex = require('../../connection');

export async function getAllSupervisors() {
    const supervisorRoleId = await getSupervisorRoleId();
    const supervisors = await knex.table('person')
        .innerJoin('personRoleField', 'person.personId', '=', 'personRoleField.personId')
        .where('roleId', supervisorRoleId);
    return supervisors;
}

export async function getSupervisorRoleId() {
    const roleData = await knex.select().from('role').where('name', 'supervisor');
    return roleData[0].roleId;
}

export async function saveNewSupervisor(data) {
    const supervisorRoleId = await getSupervisorRoleId();
    const personData = {
        firstname: data.firstname,
        lastname: data.lastname,
        title: data.title,
        email: data.email,
        shibbolethId: data.shibbolethId,
        isRetired: data.isRetired
    };
    const personId = await savePerson(personData);
    const personRoleData = {
        personId: personId,
        studyfieldId: data.studyfieldId,
        roleId: supervisorRoleId
    };
    const personRoleId = await savePersonRole(personRoleData);
    const agreementPersonData = {
        agreementId: data.agreementId,
        personRoleId: personId,
        roleId: supervisorRoleId,
        approved: false,
        statement: ''
    };
    const agreementPersonId = await saveAgreementPerson(agreementPersonData);
    return personId;
}

async function savePerson(personData) {
    return await knex('person')
        .returning('personId')
        .insert(personData)
        .then(personId => personId[0])
        .catch(err => err);
}

async function savePersonRole(personRoleData) {
    return await knex('personRoleField')
    .returning('personRoleId')
    .insert(personRoleData)
    .then(personRoleId => personRoleId[0])
    .catch(err => err);
}

async function saveAgreementPerson(agreementPersonData) {
    return await knex('agreementPerson')
    .returning('agreementId')
    .insert(agreementPersonData)
    .then(agreementId => agreementId[0])
    .catch(err => err);
}

export function updateSupervisor(data) {
    // TO DO
    return data;
}