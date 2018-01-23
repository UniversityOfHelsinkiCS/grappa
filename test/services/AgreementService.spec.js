import test from 'ava';
import { deleteFromDb } from '../utils';

const knex = require('../../src/db/connection');

const agreementService = require('../../src/services/AgreementService');
const mockAgreements = require('../../src/mockdata/MockAgreements');

test.before(async () => {
    await knex.migrate.latest();
    await deleteFromDb();
});

test.beforeEach(async () => {
    await deleteFromDb();
    await knex.seed.run();
});

test.serial('getAllAgreements returns list of right length ', async (t) => {
    const listOfAgreements = await agreementService.getAllAgreements();
    t.is(listOfAgreements.length, mockAgreements.length);
});

test.serial('saves previousAgreement and returns Id', async (t) => {
    const prevData = {
        agreementId: 2,
        previousAgreementId: 1
    };
    const agreementId = await agreementService.savePrevious(prevData);
    t.deepEqual(agreementId, prevData.agreementId);
});

test.serial('updateAgreement', async (t) => {
    const updatedAgreement = {
        agreementId: 1,
        authorId: 1,
        thesisId: 1,
        studyfieldId: 1,
        other: 'this agreement is updated'
    };
    const response = await agreementService.updateAgreement(updatedAgreement);
    Object.keys(updatedAgreement).forEach((key) => {
        if (Object.keys(response).includes(key)) {
            t.is(response[key], updatedAgreement[key])
        }
    })
});

test.serial('saveAgreement', async (t) => {
    const testData = {
        authorId: 1,
        thesisId: 1,
        responsibleSupervisorId: 1,
        studyfieldId: 1,
        studentWorkTime: '5h / week',
        fake: 0
    };

    const temp = await agreementService.saveAgreement(testData);
    t.truthy(temp.agreementId);
});
