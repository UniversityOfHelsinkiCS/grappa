import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const supervisorService = require('../src/services/SupervisorService');
const mockPersons = require('../src/mockdata/MockPersons');
const mockRoles = require('../src/mockdata/MockRoles');
const mockStudyfields = require('../src/mockdata/MockStudyfields');
const mockPersonRoles = require('../src/mockdata/MockPersonRoleFields');
const mockAgreementPersons = require('../src/mockdata/MockAgreementPersons');

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
        table.timestamps();
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
    //knex.schema.dropTableIfExists('personRoleField');
    await knex.schema.createTable('personRoleField', function (table) {
        table.increments('personRoleId').primary();
        table.integer('personId').unsigned();
        table.foreign('personId').references('person.personId');
        table.integer('roleId').unsigned();
        table.foreign('roleId').references('role.roleId');
        table.integer('studyfieldId').unsigned();
        table.foreign('studyfieldId').references('studyfield.studyfieldId');
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
    await knex('personRoleField').del();
    await knex('personRoleField').insert(mockPersonRoles);
});

test.serial('getAllSupervisors returns list of right length ', async t => {
    let listOfSupervisors = await supervisorService.getAllSupervisors();
    t.deepEqual(listOfSupervisors.length, 3);
});

test.serial('saveNewSupervisor returns new personId', async t => {
    const mockSupervisorData = {
        agreementId: 1,
        firstname: 'Test',
        lastname: 'Person'
    };
    let returnValue = await supervisorService.saveNewSupervisor(mockSupervisorData);
    t.truthy(returnValue, mockPersons.length + 1);
});
