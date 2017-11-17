import test from 'ava';
import sinon from 'sinon';
import knex from '../../connection';

const thesisService = require('../../src/services/ThesisService');
const mockTheses = require('../../src/mockdata/MockTheses');
const mockAgreements = require('../../src/mockdata/MockAgreements');
const mockPersons = require('../../src/mockdata/MockPersons');

test.before(async t => {
    await knex.schema.createTable('thesis', function (table) {
        table.increments('thesisId').primary();
        table.string('thesisTitle');
        table.date('startDate');
        table.date('completionEta');
        table.string('performancePlace');
        table.string('urkund');
        table.integer('grade');
        table.string('graderEval');
        table.integer('userId');
    });
    await knex.schema.createTable('agreement', function (table) {
        table.increments('agreementId').primary();
        table.integer('authorId').unsigned(); //author
        table.foreign('authorId').references('person.personId');
        table.integer('thesisId').unsigned();
        table.foreign('thesisId').references('thesis.thesisId');
        table.integer('responsibleSupervisorId').unsigned();
        table.foreign('responsibleSupervisorId').references('personWithRole.personRoleId');
        table.integer('studyFieldId').unsigned();
        table.foreign('studyFieldId').references('studyfield.studyfieldId');
        table.boolean('fake');
        table.integer('studentGradeGoal');
        table.string('studentWorkTime');
        table.string('supervisorWorkTime');
        table.string('intermediateGoal');
        table.string('meetingAgreement');
        table.string('other');
    });
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

// test.serial('getThesisById returns right thesis', async t => {
//     let id = '1';
//     let thesis = await thesisService.getThesisById(id);
//     let mockthesis;
//     for(let i = 0; i < mockTheses.length; i++) {
//         if (mockTheses[i].thesisId.toString() === id) {
//             mockthesis = mockTheses[i];
//         }
//     }
//     t.deepEqual(thesis, mockthesis);
// });

test.serial('updateThesis', async t => {
    const updatedThesisData = {
        thesisId: 3,
        thesisTitle: 'Updated title',
        performancePlace: 'Hima',
        urkund: 'http://',
        grade: 4,
        graderEval: 'Tarkastajien esittely',
        userId: 5
    }
    let returnValue = await thesisService.updateThesis(updatedThesisData);
    t.deepEqual(returnValue, undefined);
});
