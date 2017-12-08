import test from 'ava';
const request = require('supertest');
const express = require('express');
const agreement = require('../../src/routes/agreements');
const config = require('../../src/db/knexfile');
const reqres = require('reqres');
const personService = require("../../src/services/PersonService");

const makeApp = () => {
    const app = express();
    app.use('/agreements', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, agreement)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    console.log(waitString);
})

const agreementWithoutId = {
    authorId: 1,
    thesisId: 1,
    responsibleSupervisorId: 1,
    studyfieldId: 1,
    fake: false,
    studentGradeGoal: 5,
    studentWorkTime: "1h viikossa",
    supervisorWorkTime: "2h viikossa",
    intermediateGoal: "20 sivua ensi perjantaina",
    meetingAgreement: "Jepsis",
    other: "eihän tässä muuta",
    whoNext: "supervisor",    
}

test('agreement post & creates id', async t => {
    t.plan(15);
    const res = await request(makeApp())
        .post('/agreements')
        .send(agreementWithoutId);
    t.is(res.status, 200);
    let body = res.body;
    body.fake = body.fake !== 0;
    let agreement = agreementWithoutId;
    agreement.agreementId = 1;
    Object.keys(agreement).forEach(key => {
        t.is(agreement[key], body[key], "Key: " + key)
    })
    //Ignore createdat and updatedat
    t.is(Object.keys(agreement).length, Object.keys(body).length - 2, "Key length");
})
