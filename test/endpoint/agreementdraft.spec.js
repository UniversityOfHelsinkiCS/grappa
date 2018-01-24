import test from 'ava';
import { deleteFromDb } from '../utils';

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

test.before(async (t) => {
    await knex.migrate.latest();
    await deleteFromDb();
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
    thesisStartDate: '2005-06-04T21:00:00.000Z',
    thesisCompletionEta: '2006-01-01T22:00:00.000Z',
    thesisPerformancePlace: 'paikka',
    studentGradeGoal: 5,
    studentTime: '1h viikossa',
    supervisorTime: '1h kuussa',
    intermediateGoal: 'hmm',
    meetingAgreement: 'juu',
    other: 'uuu'
};

test('agreementDraft post & creates id', async (t) => {
    t.plan(3);
    const res = await request(makeApp(1))
        .post('/agreement-drafts')
        .send(testAgreementDraft);
    t.is(res.status, 200);
    const body = res.body;
    t.truthy(body.agreementDraftId > 0);
    delete body.agreementDraftId;
    t.deepEqual(body, testAgreementDraft);
});

test('get agreementDraft by ID', async (t) => {
    t.plan(3);
    const draft = testAgreementDraft;
    const draftPersons = [];
    const res = await request(makeApp(1))
        .get(`/agreement-drafts/${4}`);
    t.is(res.status, 200);

    const agreementDraft = res.body.agreementDraft;
    const agreementDraftPersons = res.body.agreementDraftPersons;

    delete agreementDraft.agreementDraftId;
    t.deepEqual(agreementDraft, draft, 'Drafts equal');
    t.deepEqual(agreementDraftPersons, draftPersons, 'Persons equal');
})

