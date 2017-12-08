import test from 'ava';
const request = require('supertest');
const express = require('express');
const agreement = require('../../src/routes/agreements');
const config = require('../../src/db/knexfile');
const reqres = require('reqres');
const personService = require("../../src/services/PersonService");

const makeApp = () => {
    const app = express();
    app.use('/agreement', agreement)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    console.log(waitString);
})

const agreementWithoutId = {
    personId: 10,
    firstname: 'Testi',
    lastname: 'Testinen',
}

const agreementWithId = {
    personId: 10,
    firstname: 'Testi',
    lastname: 'Testinen',
    agreementId: 1
}

const correctAgreement = {
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
}

test('agreement post with agreement which has agreementId returns 500', async t => {
    t.plan(1);
    let req = reqres.req();
    const agreementWithId = {agreementId: 1}
    const res = await request(makeApp())
        .post('/agreement')
        .send(agreementWithId);
    t.is(res.status, 500);
    //const body = res.body;
    //const agreement = agreementWithId;
    //t.is(JSON.stringify(body), JSON.stringify(agreement));
})

const makeAppWithUserId = () => {
    const app = express();
    app.use('/agreement', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, agreement)
    return app;
}

test('agreement post with correct agreement returns 200', async t => {
    t.plan(1);
    personService.savePerson({shibbolethId: "shibboId", studentNumber: "1234" });
    const session = {user_id: 1};
    const res = await request(makeAppWithUserId())
        .post('/agreement')
        .send(correctAgreement);
    t.is(res.status, 200);
})

// test.skip('councilmeeting post & creates id', async t => {
//     t.plan(2);
//     const res = await request(makeApp())
//         .post('/councilmeetings')
//         .send(councilmeetingWithoutId);
//     t.is(res.status, 200);
//     const body = res.body;
//     const meeting = councilmeetingWithId
//     t.is(JSON.stringify(body), JSON.stringify(meeting));
// })

// test.skip('councilmeeting get all', async t => {
//     t.plan(2);
//     const app = makeApp();
//     const res = await request(app)
//         .get('/councilmeetings');
//     t.is(res.status, 200);
//     const body = res.body;
//     const meetings = [ councilmeetingWithId ];
//     t.is(JSON.stringify(body), JSON.stringify(meetings));    
// })


test('', t => {
    t.truthy(1 === 1);
})
