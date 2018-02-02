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

const numberFromTo = (from, to) => Math.round(Math.random() * (to - from)) + from;

const generateThesisForm = async () => {
    const persons = await knex('person').select()
    const person1 = persons[numberFromTo(0, (persons.length / 2) - 1)]
    const person2 = persons[numberFromTo(persons.length / 2, persons.length - 1)]
    const thesisForm = {
        id: undefined,
        authorEmail: `author${numberFromTo(0, 1000)}@example.com`,
        title: `Gradu number ${numberFromTo(0, 1000)}`,
        urkund: `https://example.com/${numberFromTo(0, 1000)}`,
        grade: `${numberFromTo(1, 5)}`,
        graders: [person1, person2],
        studyfieldId: 2,
        councilmeetingId: 1,
        printDone: false,
        thesisEmails: {
            graderEvalReminder: 3,
            printReminder: 2
        }
    }
    return { thesisForm, person1, person2 }
}
const generateThesisWithId = (thesisForm, thesisId) => ({
    thesisId,
    councilmeetingId: thesisForm.councilmeetingId,
    title: thesisForm.title,
    urkund: thesisForm.urkund,
    grade: thesisForm.grade,
    printDone: thesisForm.printDone
})

const generateAgreement = (thesisForm, agreementId, thesisId, authorId, startDate) => ({
    agreementId,
    thesisId,
    authorId,
    startDate,
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
})

const generateAttachment = (attachmentId, agreementId) => ({
    attachmentId,
    agreementId,
    filename: null, // Saving to memory has no filename
    mimetype: 'application/octet-stream',
    savedOnDisk: true,
    label: 'otherFile',
    originalname: 'LICENSE'
});

const validPostForm = async (t, app, thesisForm, addAttachment) => {
    let res
    if (!addAttachment) {
        res = await request(app)
            .post('/theses')
            .field('json', JSON.stringify(thesisForm))
    } else {
        res = await request(app)
            .post('/theses')
            .field('json', JSON.stringify(thesisForm))
            .attach('otherFile', './LICENSE')
    }
    t.is(res.status, 200)
    const { thesis, author, agreement, attachments } = res.body
    const expectedThesis = generateThesisWithId(thesisForm, thesis.thesisId)
    const expectedAuthor = undefined
    const expectedAgreement = generateAgreement(thesisForm, agreement.agreementId, agreement.thesisId, agreement.authorId, agreement.startDate)
    // Check the linking is right
    t.is(thesis.thesisId, agreement.thesisId);
    // Check the contents are right
    t.deepEqual(thesis, expectedThesis, 'Thesis is not correct');
    t.deepEqual(author, expectedAuthor, 'Author person is not correct');
    t.deepEqual(agreement, expectedAgreement, 'Agreement is not correct');
    if (addAttachment) {
        t.is(attachments[0].agreementId, agreement.agreementId);
        const expectedAttachment = generateAttachment(attachments[0].attachmentId, agreement.agreementId)
        t.deepEqual(attachments[0], expectedAttachment, 'Attachment is not correct');
    }
    return res.body
}

test('thesisForm post & creates id without attachment', async (t) => {
    t.plan(6);
    const { thesisForm, person1, person2 } = await generateThesisForm()
    const app = makeApp(1)
    const { agreement } = await validPostForm(t, app, thesisForm)

    // Check that the persons are agreementPersons through personWithRole
    const personRoles = await knex.select().from('personWithRole')
        .innerJoin('agreementPerson', 'agreementPerson.personRoleId', '=', 'personWithRole.personRoleId')
        .where('roleId', 5)
        .where('agreementId', agreement.agreementId)
        .where('personId', person1.personId)
        .orWhere('personId', person2.personId)
    t.truthy(personRoles.length, 2,
        `Someone else was found linked to agreement: ${JSON.stringify(personRoles)}`);
});

test('thesis get all', async (t) => {
    t.plan(13);
    const { thesisForm: thesisForm1 } = await generateThesisForm()
    const { thesisForm: thesisForm2 } = await generateThesisForm()
    const app = makeApp(1);
    const { thesis: thesis1 } = await validPostForm(t, app, thesisForm1)
    const { thesis: thesis2 } = await validPostForm(t, app, thesisForm2)
    const sentTheses = [thesis1, thesis2]
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200);
    const responseTheses = res.body;
    sentTheses.forEach((thesis) => {
        const found = responseTheses.find(th =>
            th.thesisId === thesis.thesisId &&
            th.title === thesis.title
        )
        t.truthy(found,
            `Thesis ${JSON.stringify(thesis)} was not found in response, ${JSON.stringify(responseTheses)}`)
    })
});

test('thesisForm post & creates id with attachment', async (t) => {
    t.plan(7);
    const { thesisForm } = await generateThesisForm()
    const app = makeApp(1);
    await validPostForm(t, app, thesisForm, true)
});

test('thesisForm post sends emails', async (t) => {
    const mailer = require('../../src/util/mailer');
    const mailSpy = sinon.spy(mailer, 'sendEmail');
    const { thesisForm } = await generateThesisForm()
    const form = Object.assign({}, thesisForm);

    form.authorEmail = 'emailTest@example.com';
    form.studyfieldId = 1;
    const app = makeApp(1)
    await validPostForm(t, app, form)
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
/*
const createExistingThesis = async () => {
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

    const persons = await knex('person').select()
    const grader = persons[numberFromTo(0, persons.length - 1)]

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

    const persons = await knex('person').select()
    const grader = persons[numberFromTo(0, persons.length - 1)]

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
*/
