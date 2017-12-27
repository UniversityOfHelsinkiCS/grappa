import test from 'ava';
const request = require('supertest');
const express = require('express');
const agreementdrafts = require('../../src/routes/agreementDrafts');
const knex = require('../../src/db/connection');

const makeApp = (userId) => {
    const app = express();
    app.use('/agreement-drafts', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, agreementdrafts)
    return app;
}

test.before(async t => {
    await knex.migrate.latest();
    await knex.seed.run();
})


const testAgreementDraft = {
    mainSupervisorId: 1,
    studentEmail: 'test@tets.com',
    studentFirstname: 'Test',
    studentLastname: 'User',
    studentNumber: ('012345678'),
    studentAddress: ('Helsinginkatu'),
    studentPhone: '050 1234567',
    studentMajor: 'Kemia',
    thesisTitle: 'Thesis Title',
    thesisStartDate: '6.5.2005',
    thesisCompletionEta: '1.2.2006',
    thesisPerformancePlace: 'paikka',
    studentGradeGoal: 5,
    studentTime: '1h viikossa',
    supervisorTime: '1h kuussa',
    intermediateGoal: 'hmm',
    meetingAgreement: 'juu',
    other: 'uuu'
};

const agreementDraftPersons = [{
    agreementDraftId: 1,
    personRoleId: 1
}];

test('agreementDraft post & creates id', async t => {
    t.plan(3);
    const res = await request(makeApp(1))
        .post('/agreement-drafts')
        .send(testAgreementDraft);
    t.is(res.status, 200);
    const body = res.body;
    const draft = testAgreementDraft
    t.truthy(body.agreementDraftId > 0)
    delete body.agreementDraftId
    t.deepEqual(body, draft);
});

test('get agreementDraft by ID', async t => {
    t.plan(3);
    const draft = testAgreementDraft;
    const draftPersons = [];
    const res = await request(makeApp(1))
        .get('/agreement-drafts/' + 3);
    t.is(res.status, 200);
    const body = res.body;

    const agreementDraft = res.body.agreementDraft;
    const agreementDraftPersons = res.body.agreementDraftPersons;

    delete agreementDraft.agreementDraftId;
    t.deepEqual(agreementDraft, draft, 'Drafts equal');
    t.deepEqual(agreementDraftPersons, draftPersons, 'Persons equal');
})

