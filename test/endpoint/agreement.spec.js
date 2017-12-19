import test from 'ava';
const request = require('supertest');
const express = require('express');
const agreement = require('../../src/routes/agreements');

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
    // console.log(waitString);
})

const agreementForm = {
    thesisTitle: "my Thesis",
    thesisStartDate: "9.9.2017",
    thesisCompletionEta: "9.9.2018",
    thesisPerformancePlace: "helsinki",

    thesisSupervisorMain: "matti luukkainen",
    thesisSupervisorSecond: "sauli niinnistö",
    thesisSupervisorOther: "",

    thesisWorkStudentTime: "1h viikossa",
    thesisWorkSupervisorTime: "2h viikossa",
    thesisWorkIntermediateGoal: "vain taivas on rajana",
    thesisWorkMeetingAgreement: "joka toinen viikko",
    thesisWorkOther: "",

    studentGradeGoal: "5",

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

const agreementWithId = {
    agreementId: 1,
    authorId: 1,
    thesisId: 1,
    responsibleSupervisorId: 1,
    studyfieldId: 1,
    fake: 0,
    studentGradeGoal: 5,
    studentWorkTime: "1h viikossa",
    supervisorWorkTime: "tsiigaillaan",
    intermediateGoal: "oispa valmistunut",
    meetingAgreement: "just just",
    other: "eihän tässä muuta"
}

//TODO: Test something like thesis: thesisForm post & creates id without attachment
test.skip('agreement post & correct response', async t => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/agreements')
        .send(agreementForm);
    t.is(res.status, 200);
    const thesis = res.body.thesis;
    const author = res.body.author;
    const agreement = res.body.agreement;
    
})
