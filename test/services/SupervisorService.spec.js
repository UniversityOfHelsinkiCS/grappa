import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../../src/db/connection');

const supervisorService = require('../../src/services/SupervisorService');
const mockPersons = require('../../src/mockdata/MockPersons');
const mockRoles = require('../../src/mockdata/MockRoles');
const mockStudyfields = require('../../src/mockdata/MockStudyfields');
const mockPersonRoles = require('../../src/mockdata/MockPersonRoleFields');
const mockAgreementPersons = require('../../src/mockdata/MockAgreementPersons');

let supervisorRoleId;
mockRoles.map(role => {
    if (role.name === 'supervisor') {
        supervisorRoleId = role.roleId;
    }
})

test.before(async t => {
    //knex.schema.dropTableIfExists('person');
    await knex.schema.createTable('person', function (table) {
        table.increments('personId').primary();
        table.string('shibbolethId');
        table.string('email');
        table.string('firstname');
        table.string('lastname');
        table.string('title')
        table.boolean('isRetired');
        table.string('studentNumber');
        table.string('address');
        table.string('phone');
        table.string('major');
    });
    await knex.schema.createTable('studyfield', function (table) {
        table.increments('studyfieldId').primary();
        table.integer('facultyId').unsigned();
        table.foreign('facultyId').references('faculty.facultyId');
        table.string('name');
        table.timestamps();
    });
    await knex.schema.createTable('role', function (table) {
        table.increments('roleId').primary();
        table.string('name');
    });
    //knex.schema.dropTableIfExists('personWithRole');
    await knex.schema.createTable('personWithRole', function (table) {
        table.increments('personRoleId').primary();
        table.integer('personId').unsigned();
        table.foreign('personId').references('person.personId');
        table.integer('roleId').unsigned();
        table.foreign('roleId').references('role.roleId');
        table.integer('studyfieldId').unsigned();
        table.foreign('studyfieldId').references('studyfield.studyfieldId');
    });

    await knex.schema.createTable('agreementPerson', function (table) {
        table.integer('agreementId').unsigned();
        table.foreign('agreementId').references('agreement.agreementId');
        table.integer('personRoleId').unsigned(); //grader
        table.foreign('personRoleId').references('personWithRole.personRoleId');
        table.integer('roleId').unsigned();
        table.foreign('roleId').references('role.roleId');
        table.integer('approverId').unsigned();
        table.foreign('approverId').references('personWithRole.personRoleId');
        table.boolean('approved');
        table.date('approvalDate');
        table.string('statement');
    });
});

test.beforeEach(async t => {
    //knex.schema.dropTableIfExists('agreement');
    await knex('person').del();
    await knex('person').insert(mockPersons);
    await knex('studyfield').del();
    await knex('studyfield').insert(mockStudyfields);
    await knex('role').del();
    await knex('role').insert(mockRoles);
    await knex('personWithRole').del();
    await knex('personWithRole').insert(mockPersonRoles);
    await knex('agreementPerson').del();
    await knex('agreementPerson').insert(mockAgreementPersons);
});

test.serial('getAllSupervisors returns list of right length ', async t => {
    let listOfSupervisors = await supervisorService.getAllSupervisors();
    t.deepEqual(listOfSupervisors.length, 3);
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

test.serial('getSupervisorRoleId returns correct ID', async t => {
    let returnValue = await supervisorService.getSupervisorRoleId();
    t.deepEqual(returnValue, supervisorRoleId);
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
