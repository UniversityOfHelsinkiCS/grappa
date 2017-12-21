import test from 'ava';
import sinon from 'sinon';
import knex from '../../src/db/connection';

const thesisService = require('../../src/services/ThesisService');
const mockTheses = require('../../src/mockdata/MockTheses');
const mockAgreements = require('../../src/mockdata/MockAgreements');
const mockPersons = require('../../src/mockdata/MockPersons');

test.before(async t => {
    await knex.migrate.latest();
})

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
    let updatedThesisData = {
        thesisId: 2,
        title: 'Updated title',
        urkund: 'http://',
        graderEval: 'Tarkastajien esittely',
    }
    let returnValue = await thesisService.updateThesis(updatedThesisData);
    updatedThesisData.printDone = 0
    updatedThesisData.grade = '1'
    t.deepEqual(returnValue, updatedThesisData);
});
