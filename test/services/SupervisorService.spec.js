import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../../src/db/connection');

const supervisorService = require('../../src/services/SupervisorService');
const mockPersons = require('../../src/mockdata/MockPersons');
const mockRoles = require('../../src/mockdata/MockRoles');
const mockStudyfields = require('../../src/mockdata/MockProgrammes');
const mockPersonRoles = require('../../src/mockdata/MockPersonRoleFields');
const mockAgreementPersons = require('../../src/mockdata/MockAgreementPersons');

let supervisorRoleId;
mockRoles.map(role => {
    if (role.name === 'supervisor') {
        supervisorRoleId = role.roleId;
    }
})

test.before(async t => {
    await knex.migrate.latest();
});

test.beforeEach(async t => {
    //knex.schema.dropTableIfExists('agreement');
    await knex('person').del();
    await knex('person').insert(mockPersons);
    await knex('programme').del();
    await knex('programme').insert(mockStudyfields);
    await knex('role').del();
    await knex('role').insert(mockRoles);
    await knex('personWithRole').del();
    await knex('personWithRole').insert(mockPersonRoles);
    await knex('agreementPerson').del();
    await knex('agreementPerson').insert(mockAgreementPersons);
});

test.serial('getAllSupervisors returns list of right length ', async t => {
    let listOfSupervisors = await supervisorService.getAllSupervisors();
    t.deepEqual(listOfSupervisors.length, 4);
});

test.serial('saveAgreementPerson returns agreementId', async t => {
    const mockAgreementPerson = {
        agreementId: 2,
        personRoleId: 2,
        roleId: 1,
        approved: false,
        statement: ''
    };
    let returnValue = await supervisorService.saveAgreementPerson(mockAgreementPerson);
    t.truthy(returnValue, mockAgreementPerson.agreementId);
});


test.serial('updateAgreementPerson returns correct ID', async t => {
    const mockAgreementPerson = {
        agreementId: 2,
        personRoleId: 2,
        approved: true,
        approverId: 1,
        statement: 'I approve this supervisor'
    };
    let returnValue = await supervisorService.updateAgreementPerson(mockAgreementPerson);
    t.deepEqual(returnValue, undefined);
});
