require('babel-polyfill');
const knex = require('../db/connection');
const roleService = require('./RoleService');

//people whose role is supervisor
export async function getAllSupervisors() {
    const supervisorRoleId = await roleService.getRoleId('supervisor');
    const supervisors = await knex.table('person')
        .innerJoin('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', supervisorRoleId);
    return supervisors;
}

//people whose role is supervisor in a studyfield
export async function getAllSupervisorsByStudyfield(studyfieldId) {
    const supervisorRoleId = await roleService.getRoleId('supervisor');
    const supervisors = await knex.table('person')
        .innerJoin('personWithRole', 'person.personId', '=', 'personWithRole.personId')
        .where('roleId', supervisorRoleId)
        .andWhere('studyfieldId', studyfieldId);
    return supervisors;
}

//people who are supervising theses at the moment
export async function getAllAgreementPersons() {
    return knex.table('agreementPerson')
        .innerJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .innerJoin('agreement', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
        .innerJoin('thesis', 'agreement.thesisId', '=', 'thesis.thesisId')
        .then(persons => {
            return persons;
        });
}

//people who are supervising theses at the moment in a studyfield
export async function getAllAgreementPersonsByStudyfield(studyfieldId) {
    return knex.table('agreementPerson')
        .innerJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .innerJoin('agreement', 'agreementPerson.agreementId', '=', 'agreement.agreementId')
        .innerJoin('thesis', 'agreement.thesisId', '=', 'thesis.thesisId')
        .where('studyfieldId', studyfieldId)
        .then(persons => {
            return persons;
        });
}

export async function getAgreementPersonsNeedingApproval() {
    return knex.table('agreementPerson')
        .innerJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('approved', false)
        .andWhereNot('agreementId', null)
        .then(persons => {
            return persons;
        });
}

export async function getSupervisorByEmail(email) {
    return knex.table('agreementPerson')
        .innerJoin('personWithRole', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .innerJoin('person', 'personWithRole.personId', '=', 'person.personId')
        .where('email', email)
        .then(supervisor => {
            return supervisor[0];
        })
        .catch(error => {
            throw error;
        }) 
}

export async function saveAgreementPerson(agreementPersonData) {
    return await knex('agreementPerson')
        .returning('agreementId')
        .insert(agreementPersonData)
        .then(agreementId => agreementId[0])
        .catch(err => err);
}

export async function updateAgreementPerson(agreementPersonData) {
    console.log('agreementperson datasta approved, service', agreementPersonData.approved)
    return await knex('agreementPerson')
        .returning('personRoleId')
        .where('personRoleId', '=', agreementPersonData.personRoleId)
        .andWhere('agreementId', '=', agreementPersonData.agreementId)
        .update(agreementPersonData)
        .then(personRoleId => personRoleId[0])
        .catch(err => err);
}