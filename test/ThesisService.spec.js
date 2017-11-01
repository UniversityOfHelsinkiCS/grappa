import test from 'ava';
import sinon from 'sinon';
import knex from '../connection';

const thesisService = require('../src/services/ThesisService');
const mockTheses = require('../src/mockdata/MockTheses');
const mockAgreements = require('../src/mockdata/MockAgreements');
const mockPersons = require('../src/mockdata/MockPersons');

test.before(async t => {
    await knex.schema.createTable('thesis', function (table) {
        table.increments('thesisId').primary();
        table.string('authorFirstname');
        table.string('authorLastname');
        table.string('authorEmail');
        table.string('title');
        table.string('urkund');
        table.integer('grade');
        table.string('graderEval');
        table.integer('studyFieldId');
        table.integer('userId');
        table.timestamps();
    });
    await knex.schema.createTable('agreement', function (table) {
        table.increments('agreementId').primary();
        table.integer('authorId');
        table.integer('thesisId');
        table.integer('responsibleSupervisor');
        table.integer('studyFieldId');
        table.boolean('fake');
        table.timestamps();
    });
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
});

test.beforeEach(async t => {
    await knex('thesis').del();
    await knex('thesis').insert(mockTheses);
    await knex('agreement').del();
    await knex('agreement').insert(mockAgreements);
    await knex('person').del();
    await knex('person').insert(mockPersons);
});

test.serial('getAllTheses returns list of right length ', async t => {
    let listOfTheses = await thesisService.getAllTheses();
    t.deepEqual(listOfTheses.length, mockTheses.length);
});

test.serial('getThesisById returns right thesis', async t => {
    let id = '1';
    let thesis = await thesisService.getThesisById(id);
    let mockthesis;
    for(let i = 0; i < mockTheses.length; i++) {
        if (mockTheses[i].thesisId.toString() === id) {
            mockthesis = mockTheses[i];
        }
    }
    t.deepEqual(thesis[0], mockthesis);
});
