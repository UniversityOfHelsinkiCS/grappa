import test from 'ava';
import sinon from 'sinon';
const knex = require('../../src/db/connection');

const agreementService = require('../../src/services/AgreementService');
const mockAgreements = require('../../src/mockdata/MockAgreements');
const mockPrevAgreements = require('../../src/mockdata/MockPrevAgreements');

test.before(async t => {
    await knex.migrate.latest();
});

test.beforeEach(async t => {
    await knex('agreement').del();
    await knex('agreement').insert(mockAgreements);
    await knex('previousagreements').del();
    await knex('previousagreements').insert(mockPrevAgreements);
});

test.serial('getAllAgreements returns list of right length ', async t => {
    let listOfAgreements = await agreementService.getAllAgreements();
    t.is(listOfAgreements.length, mockAgreements.length);
});

test.serial('saves previousAgreement and returns Id', async t => {
    const prevData = {
        agreementId: 2,
        previousAgreementId: 1
    };
    let agreementId = await agreementService.savePrevious(prevData);
    t.deepEqual(agreementId, prevData.agreementId);
});

test.serial('updateAgreement', async t => {
    const updatedAgreement = {
        agreementId: 1,
        authorId: 1,
        thesisId: 1,
        studyfieldId: 1,
        other: 'this agreement is updated'
    };
    const response = await agreementService.updateAgreement(updatedAgreement);
    Object.keys(updatedAgreement).forEach(key => {
        if (Object.keys(response).includes(key)) {
            t.is(response[key], updatedAgreement[key])
        }
    })
});

test.serial('saveAgreement call returns agreementId = 4', async t => {
    const testData = {
        authorId: 1,
        thesisId: 1,
        responsibleSupervisorId: 1,
        studyfieldId: 1,
        studentWorkTime: "5h / week",
        fake: 0
    };

    let temp = await agreementService.saveAgreement(testData);
    t.is(temp.agreementId, 4);
});
