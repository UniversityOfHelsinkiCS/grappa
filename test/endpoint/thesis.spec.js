import test from 'ava';
const request = require('supertest');
const express = require('express');
const theses = require('../../src/routes/theses');

const makeApp = () => {
    const app = express();
    app.use('/theses', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, theses)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    //console.log(waitString);
})

const thesisForm = {
    id: undefined,
    authorFirstname: "Etunimi",
    authorLastname: "Sukunimi",
    authorEmail: "Email",
    title: "Annin Grady",
    urkund: "https://",
    grade: "4",
    graders: [{
        address: "Intiankatu",
        email: "thomas@tarkastaja.com",
        firstname: "Thomas",
        isRetired: 0,
        lastname: "CS-Tarkastaja",
        major: "mathematics",
        personId: 5,
        phone: "050 1234567",
        shibbolethId: "thomastarkastajashibboId",
        studentNumber: "876548321",
        title: "",
    }],
    graderEval: "Tarkastajien esittely",
    studyfieldId: 2,
    councilmeetingId: 1,
    printDone: false,
    thesisEmails: {
        graderEvalReminder: 3,
        printReminder: 2,
    },
}

const graders = thesisForm.graders

const thesisWithId = {
    thesisId: 1,
    title: "Annin Grady",
    urkund: "https://",
    grade: "4",
    graderEval: "Tarkastajien esittely",
    userId: 1,
    printDone: 0
}

const person = {
    personId: 1,
    shibbolethId: null,
    firstname: "Etunimi",
    lastname: "Sukunimi",
    email: "Email",
    title: null,
    isRetired: null,
    studentNumber: null,
    address: null,
    phone: null,
    major: null
}

const fakeAgreement = {
    agreementId: 1,
    authorId: null,
    thesisId: thesisWithId.thesisId,
    responsibleSupervisorId: null,
    studyfieldId: thesisForm.studyfieldId,
    fake: 1,
    startDate: null,
    completionEta: null,
    performancePlace: null,
    studentGradeGoal: null,
    studentWorkTime: null,
    supervisorWorkTime: null,
    intermediateGoal: null,
    meetingAgreement: null,
    other: null,
    whoNext: null
}

test('thesisForm post & creates id without attachment', async t => {
    t.plan(4);
    const res = await request(makeApp())
        .post('/theses')
        .field('json', JSON.stringify(thesisForm))
    t.is(res.status, 200);
    const thesis = res.body.thesis;
    const author = res.body.author;
    const agreement = res.body.agreement;
    t.deepEqual(thesis, thesisWithId, "Thesis is correct");
    t.deepEqual(author, person, "Author person is correct");
    t.deepEqual(agreement, fakeAgreement, "Agreement is correct");
})

test('thesis get all', async t => {
    t.plan(3);
    const app = makeApp();
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200);
    const body = res.body;
    const bodyThesis = body[0]
    t.deepEqual(thesisWithId, bodyThesis)
    t.is(body.length, 1);
})

const attachment = {
    attachmentId: 1,
    agreementId: 2,
    filename: null, //Saving to memory has no filename
    type: 'application/octet-stream',
    savedOnDisk: 1
}

test('thesisForm post & creates id with attachment', async t => {
    t.plan(5);
    const res = await request(makeApp())
        .post('/theses')
        .field('json', JSON.stringify(thesisForm))
        .attach('attachment', './LICENSE')
    t.is(res.status, 200);
    const thesis = res.body.thesis;
    const author = res.body.author;
    const agreement = res.body.agreement;
    const attachments = res.body.attachments;
    let testThesis = thesisWithId;
    testThesis.thesisId = 2;
    let testAgreement = fakeAgreement;
    fakeAgreement.thesisId = 2;
    fakeAgreement.agreementId = 2;
    t.deepEqual(thesis, testThesis, "Thesis is correct");
    t.deepEqual(author, person, "Author person is correct");
    t.deepEqual(agreement, testAgreement, "Agreement is correct");
    t.deepEqual(attachments, [attachment], "Attachments are correct");
})