import test from 'ava';
import sinon from 'sinon';
import { createPerson, initDb } from '../utils';

process.env.DB_SCHEMA = 'thesis_test';

const request = require('supertest');
const express = require('express');
const theses = require('../../src/routes/theses');
const knex = require('../../src/db/connection').getKnex();
const errorHandler = require('../../src/util/errorHandler');

const makeApp = (userId) => {
    const app = express();
    app.use('/theses', (req, res, next) => {
        req.session = {};
        req.session.user_id = userId;
        next();
    }, theses);

    app.use(errorHandler);

    return app;
};

test.before(async () => {
    await initDb();
});

const grader = {
    address: 'Intiankatu',
    email: 'thomas@tarkastaja.com',
    firstname: 'Thomas',
    isRetired: false,
    lastname: 'CS-Tarkastaja',
    major: 'mathematics',
    personId: 5,
    phone: '050 1234567',
    shibbolethId: 'thomastarkastajashibboId',
    studentNumber: '876548321',
    title: ''
};
const thesisForm = {
    id: undefined,
    authorEmail: 'author@example.com',
    title: 'Annin Grady',
    urkund: 'https://example.com',
    grade: '4',
    graders: [grader],
    studyfieldId: 2,
    councilmeetingId: 1,
    printDone: false,
    thesisEmails: {
        graderEvalReminder: 3,
        printReminder: 2
    }
};

const thesisWithId = {
    councilmeetingId: 1,
    title: 'Annin Grady',
    urkund: 'https://example.com',
    grade: '4',
    printDone: false
};

const fakeAgreement = {
    responsibleSupervisorId: null,
    studyfieldId: thesisForm.studyfieldId,
    fake: true,
    completionEta: null,
    performancePlace: null,
    studentGradeGoal: null,
    studentWorkTime: null,
    supervisorWorkTime: null,
    intermediateGoal: null,
    meetingAgreement: null,
    other: null,
    whoNext: null
};

test('thesisForm post & creates id without attachment', async (t) => {
    t.plan(5);
    const res = await request(makeApp(1))
        .post('/theses')
        .field('json', JSON.stringify(thesisForm));
    t.is(res.status, 200);

    const { thesis, author, agreement } = res.body;

    // Check the linking is right
    t.is(thesis.thesisId, agreement.thesisId);
    delete thesis.thesisId;
    delete agreement.agreementId;
    delete agreement.thesisId;
    delete agreement.authorId;
    delete agreement.startDate;
    // Check the contents are right
    t.deepEqual(thesis, thesisWithId, 'Thesis is correct');
    t.deepEqual(author, undefined, 'Author person is correct');
    t.deepEqual(agreement, fakeAgreement, 'Agreement is correct');
});

test.skip('thesis get all', async (t) => {
    t.plan(2);
    const app = makeApp(1);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200);
    const theses = res.body;
    t.is(theses.length, 4); // TODO: Fix this, fails if this spec file is run alone
});

const attachment = {
    filename: null, // Saving to memory has no filename
    mimetype: 'application/octet-stream',
    savedOnDisk: true,
    label: 'otherFile',
    originalname: 'LICENSE'
};

test('thesisForm post & creates id with attachment', async (t) => {
    t.plan(7);
    const res = await request(makeApp(1))
        .post('/theses')
        .field('json', JSON.stringify(thesisForm))
        .attach('otherFile', './LICENSE');
    t.is(res.status, 200);

    const { thesis, author, agreement, attachments } = res.body;

    // Check the linking is right
    t.is(thesis.thesisId, agreement.thesisId);
    t.is(attachments[0].agreementId, agreement.agreementId);
    delete thesis.thesisId;
    delete attachments[0].attachmentId;
    delete agreement.agreementId;

    delete agreement.thesisId;
    delete agreement.authorId;
    delete agreement.startDate;
    delete attachments[0].agreementId;
    // Check the contents are right
    t.deepEqual(thesis, thesisWithId, 'Thesis is correct');
    t.deepEqual(author, undefined, 'Author person is correct');
    t.deepEqual(agreement, fakeAgreement, 'Agreement is correct');
    t.deepEqual(attachments[0], attachment, 'Attachments are correct');
});

test('thesisForm post sends emails', async (t) => {
    const mailer = require('../../src/util/mailer');
    const mailSpy = sinon.spy(mailer, 'sendEmail');
    const form = Object.assign({}, thesisForm);

    form.authorEmail = 'emailTest@example.com';
    form.studyfieldId = 1;

    await request(makeApp(1))
        .post('/theses')
        .field('json', JSON.stringify(form));

    t.true(mailSpy.calledWith(form.authorEmail), 'Email 1 ok');
    t.true(mailSpy.calledWith('victoria@vastuuproffa.com'), 'Email 2 ok');
    t.true(mailSpy.calledWith('erkki@erikoistapaus.com'), 'Email 3 ok');
});

test('author can see own thesis', async (t) => {
    const title = 'My own thesis';
    const personId = await createPerson();
    const thesis = await knex('thesis').insert({ title }).returning('thesisId');
    await knex('agreement').insert({ authorId: personId, thesisId: thesis[0] }).returning('agreementId');

    const res = await request(makeApp(personId)).get('/theses');

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('grader can see thesis', async (t) => {
    const title = 'Thesis to grade';
    const personId = await createPerson();

    const role = await knex('personWithRole').insert({ personId, roleId: 5 }).returning('personRoleId');
    const thesis = await knex('thesis').insert({ title }).returning('thesisId');
    const agreement = await knex('agreement').insert({ thesisId: thesis[0] }).returning('agreementId');
    await knex('agreementPerson').insert({ agreementId: agreement[0], personRoleId: role[0] });

    const res = await request(makeApp(personId)).get('/theses');

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('resp prof can see programme thesis', async (t) => {
    const title = 'Studyfield thesis';
    const personId = await createPerson();
    const programme = await knex('programme')
        .insert({ name: 'test programme' })
        .returning('programmeId');
    const studyfield = await knex('studyfield')
        .insert({ name: 'test studyfield', programmeId: programme[0] })
        .returning('studyfieldId');
    const thesis = await knex('thesis')
        .insert({ title })
        .returning('thesisId');
    await knex('personWithRole')
        .insert({ personId, roleId: 4, programmeId: programme[0] })
        .returning('personRoleId');
    await knex('agreement')
        .insert({ thesisId: thesis[0], studyfieldId: studyfield[0] })
        .returning('agreementId');

    const res = await request(makeApp(personId)).get('/theses');

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test.serial('admin can see all theses', async (t) => {
    const theses = await knex('thesis');
    const res = await request(makeApp(1)).get('/theses');

    t.is(res.body.length, theses.length);
});

test.serial('invalid thesis is not accepted', async (t) => {
    const theses = await knex('thesis');
    const agreements = await knex('agreement');

    const data = {
        grade: '4'
    };

    const res = await request(makeApp(1))
        .post('/theses')
        .field('json', JSON.stringify(data));

    t.is(res.status, 500);

    const thesesAfter = await knex('thesis');
    const agreementsAfter = await knex('agreement');

    t.is(theses.length, thesesAfter.length);
    t.is(agreements.length, agreementsAfter.length);
});

test('thesis is validated when updated', async (t) => {
    const thesis = {
        title: 'Annin Grady',
        urkund: 'https://example.com',
        grade: '4',
        printDone: false
    };
    const thesisId = await knex('thesis')
        .insert(thesis)
        .returning('thesisId');

    const update = {
        thesisId: thesisId[0],
        title: '',
        urkund: '',
        grade: '',
        printDone: false
    };

    const res = await request(makeApp(1))
        .put('/theses')
        .send(update);

    t.is(res.status, 500);
});

async function createExistingThesis() {
    const thesis = {
        title: 'Annin Grady',
        urkund: 'https://example.com',
        grade: '4',
        printDone: false
    };

    const thesisId = await knex('thesis')
        .insert(thesis)
        .returning('thesisId');

    const agreementId = await knex('agreement')
        .insert({ thesisId: thesisId[0], studyfieldId: 2 })
        .returning('agreementId');

    await knex('agreementPerson').insert({
        agreementId: agreementId[0],
        personRoleId: 5,
        approverId: 2,
        approved: true
    });

    return thesisId[0];
}


test('thesis can be updated', async (t) => {
    t.plan(2);

    const thesisId = await createExistingThesis();

    const update = {
        thesisId,
        title: 'New name',
        graders: [grader]
    };

    const res = await request(makeApp(5))
        .put('/theses')
        .send(update);

    t.is(res.status, 200);

    const thesisFromDb = await knex('thesis').select().where('thesisId', thesisId).first();

    t.is(thesisFromDb.title, 'New name');
});

test('thesis edit access is checked', async (t) => {
    const thesisId = await createExistingThesis();

    const update = {
        thesisId,
        title: 'New name',
        graders: [grader]
    };

    await request(makeApp(9))
        .put('/theses')
        .send(update);

    const thesis = await knex('thesis').select().where('thesisId', thesisId).first();

    t.is('Annin Grady', thesis.title);
});

test('mark thesis printed', async (t) => {
    const thesisId = await createExistingThesis();

    const res = await request(makeApp(1))
        .put('/theses/printed')
        .send([thesisId]);

    t.is(res.status, 200);
    const thesisAfter = await knex('thesis').select().where('thesisId', thesisId).first();
    t.true(thesisAfter.printDone);
});
