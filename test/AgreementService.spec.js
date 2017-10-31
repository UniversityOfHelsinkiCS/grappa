import test from 'ava';
import sinon from 'sinon';
//import knex from 'knex';
const knex = require('../connection');

const agreementService = require('../src/services/AgreementService');
const mockAgreements = require('../src/mockdata/MockAgreements');
const mockPrevAgreements = require('../src/mockdata/MockPrevAgreements');

test.before(async t => {
    //knex.schema.dropTableIfExists('agreement');
    //let temp = knex.raw('SELECT * FROM agreement');
    await knex.schema.createTable('agreement', function (table) {
        table.increments('agreementId').primary();
        table.integer('authorId');
        table.integer('thesisId');
        table.integer('responsibleSupervisor');
        table.integer('studyFieldId');
        table.boolean('fake');
        table.timestamps();
    });
    await knex.schema.createTable('previousagreements', function (table) {
        table.integer('agreementId');
        table.foreign('agreementId').references('agreement.agreementId')
        table.integer('previousAgreementId');
        table.foreign('previousAgreementId').references('agreement.agreementId')
        table.primary(['agreementId', 'previousAgreementId']);
    });
});

test.beforeEach(async t => {
    //knex.schema.dropTableIfExists('agreement');
    //let temp = knex.raw('SELECT * FROM agreement');
    await knex('agreement').del();
    await knex('agreement').insert(mockAgreements);
    await knex('previousagreements').del();
    await knex('previousagreements').insert(mockPrevAgreements);
});

test.serial('getAllAgreements returns list of right length ', async t => {
    let listOfAgreements = await agreementService.getAllAgreements();
    t.deepEqual(listOfAgreements.length, mockAgreements.length);
});

test.serial('AgreementService returns an agreement by id correctly', async t => {

    let id = '1';
    let agreement = await agreementService.getAgreementById(id);
    let mockAgreement;
    for (let i = 0; i < mockAgreements.length; i++) {
        if (mockAgreements[i].agreementId.toString() === id) {
            mockAgreement = mockAgreements[i];
        }
    }
    t.is(agreement.length, 1);
    t.deepEqual(agreement[0], mockAgreement);
});

test.serial('saveNewAgreement call returns agreementId = 4', async t => {
    const testData = {
        authorId: 1,
        thesisId: 1,
        responsibleSupervisor: 1,
        studyFieldId: 1,
        fake: 0,
        created_at: null,
        updated_at: null
    };


    var temp = await agreementService.saveNewAgreement(testData);
    console.log(temp);
    t.truthy(temp == 4);
    /*
    await knex('agreement')
    .returning('agreementId')
    .insert(testData)
    .then((agreementId) => {
        console.log( {text: 'New agreement saved to backend', agreementId: agreementId[0]});
        t.truthy(agreementId[0]==3)
      });
      */

});
