import test from 'ava';
import sinon from 'sinon';
const knex = require('../../src/db/connection');

const agreementService = require('../../src/services/AgreementService');
const mockAgreements = require('../../src/mockdata/MockAgreements');
const mockPrevAgreements = require('../../src/mockdata/MockPrevAgreements');

test.before(async t => {
    await knex.schema.createTable('agreement', function (table) {
        table.increments('agreementId').primary();
        table.integer('authorId').unsigned();
        table.foreign('authorId').references('person.personId');
        table.integer('thesisId').unsigned();
        table.foreign('thesisId').references('thesis.thesisId');
        table.integer('responsibleSupervisorId').unsigned();
        table.foreign('responsibleSupervisorId').references('personWithRole.personRoleId');
        table.integer('studyfieldId').unsigned();
        table.foreign('studyfieldId').references('studyfield.studyfieldId');
        table.boolean('fake');
        table.date('startDate');
        table.date('completionEta');
        table.string('performancePlace');
        table.integer('studentGradeGoal');
        table.string('studentWorkTime');
        table.string('supervisorWorkTime');
        table.string('intermediateGoal');
        table.string('meetingAgreement');
        table.string('other');
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
