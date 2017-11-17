import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const personService = require('../src/services/PersonService');
const mockPersons = require('../src/mockdata/MockPersons');
const mockPersonRoles = require('../src/mockdata/MockPersonRoleFields');

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
});

test.beforeEach(async t => {
    //knex.schema.dropTableIfExists('agreement');
    await knex('person').del();
    await knex('person').insert(mockPersons);
    await knex('personWithRole').del();
    await knex('personWithRole').insert(mockPersonRoles);
});

test.serial('savePerson returns new personId', async t => {
    let newPerson = {
        shibbolethId: 'zippoletid10',
        email: 'firstname.lastname@gmail.com',
        title: 'Dr.',
        firstname: 'New',
        lastname: 'Person',
        isRetired: false,
    }
    let returnValue = await personService.savePerson(newPerson);
    t.deepEqual(returnValue, mockPersons.length + 1);
});

test.serial('savePersonRole return new personRoleId', async t => {
    let newPersonRole = {
        personId: 1,
        roleId: 1,
        studyfieldId: 1,
    }
    let returnValue = await personService.savePersonRole(newPersonRole);
    t.deepEqual(returnValue, mockPersonRoles.length + 1);
});

test.serial('updatePerson', async t => {
    let updatedPersonData = {
        personId: 1,
        shibbolethId: 'zippoletid10',
        email: 'firstname.lastname@gmail.com',
        title: 'Dr.',
        firstname: 'Updated',
        lastname: 'Person',
        isRetired: false,
    }
    let returnValue = await personService.updatePerson(updatedPersonData);
    t.deepEqual(returnValue, 1);
});

// test.serial('getPersonById returns right person', async t => {
//     let id = '1';
//     let person = await personService.getPersonById(id);
//     let mocktperson;
//     for(let i = 0; i < mockPersons.length; i++) {
//         if (mockPersons[i].personId.toString() === id) {
//             mocktperson = mockPersons[i];
//         }
//     }
//     t.deepEqual(person[0], mocktperson);
// });
