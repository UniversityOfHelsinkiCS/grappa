import test from 'ava';
import sinon from 'sinon';
import knex from '../connection';

const thesisService = require('../src/services/ThesisService');
const mockTheses = require('../src/mockdata/Theses');

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
    })

});

test.beforeEach(async t => {
    await knex('thesis').del();
    await knex('thesis').insert(mockTheses);
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
