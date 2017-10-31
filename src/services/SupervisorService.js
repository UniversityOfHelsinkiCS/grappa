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

export async function saveAgreementPerson(agreementPersonData) {
    return await knex('agreementPerson')
        .returning('agreementId')
        .insert(agreementPersonData)
        .then(agreementId => agreementId[0])
        .catch(err => err);
}

export function approveSupervisor(data) {
    // TO DO
    return data;
}