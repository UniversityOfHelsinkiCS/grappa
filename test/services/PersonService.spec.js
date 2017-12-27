import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../../src/db/connection');

const personService = require('../../src/services/PersonService');
const mockPersons = require('../../src/mockdata/MockPersons');
const mockPersonRoles = require('../../src/mockdata/MockPersonRoleFields');

test.before(async t => {
    await knex.migrate.latest();
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
    t.deepEqual(returnValue.personId, mockPersons.length + 1);
});

test.serial('savePersonRole return new personRoleId', async t => {
    let newPersonRole = {
        personId: 1,
        roleId: 1,
        studyfieldId: 1,
    }
    let returnValue = await personService.savePersonRole(newPersonRole);
    t.deepEqual(returnValue, mockPersonRoles[mockPersonRoles.length - 1].personRoleId + 1);
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

test.serial('getPersonByDetails', async t => {
    const person = await personService.getPersonByDetails('Amanda', 'Admin', 'amanda@admin.com');
    t.truthy(person);
});

test.serial('getPersonByDetails not found', async t => {
    const person = await personService.getPersonByDetails('Amanda', 'NonAdmin', 'amanda@admin.com');
    t.falsy(person);
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
