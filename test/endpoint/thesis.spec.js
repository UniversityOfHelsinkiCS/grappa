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

const createAdmin = async () => {
    const person = await createPerson();
    await knex('personWithRole')
        .insert({ personId: person.personId, roleId: 1, programmeId: 1 })
    return person
}

const generateThesisForm = async () => {
    const person1 = await createPerson();
    const person2 = await createPerson();
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
    const { personId: adminId } = await createAdmin();
    const app = makeApp(adminId)
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
    const { personId: adminId } = await createAdmin();
    const app = makeApp(adminId)
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
    const { personId: adminId } = await createAdmin();
    const app = makeApp(adminId)
    await validPostForm(t, app, thesisForm, true)
});

test('thesisForm post sends emails', async (t) => {
    t.plan(8);
    const mailer = require('../../src/util/mailer');
    const mailSpy = sinon.stub(mailer, 'sendEmail');
    const { thesisForm } = await generateThesisForm()
    const form = Object.assign({}, thesisForm);

    form.authorEmail = 'emailTest@example.com';
    form.studyfieldId = 1;
    const { personId: adminId } = await createAdmin();
    const app = makeApp(adminId)
    await validPostForm(t, app, form)
    t.true(mailSpy.calledWith(form.authorEmail), 'Email 1 ok');
    t.true(mailSpy.calledWith('victoria@vastuuproffa.com'), 'Email 2 ok');
    t.true(mailSpy.calledWith('erkki@erikoistapaus.com'), 'Email 3 ok');
});

// Since linking is done via email, insert data straight to tables

const insertThesisWithAuthorAndPersonInRole = async (authorId, personId, roleId) => {
    // RoleIds: 1 admin, 2 manager, 3 print-person, 4 resp-prof, 5 grader, 6 supervisor
    const title = `Another ${numberFromTo(1, 10000)} title ${numberFromTo(1, 10000)}`
    const thesisIds = await knex('thesis')
        .insert({
            title,
            urkund: 'https://urkund.com',
        })
        .returning('thesisId');
    const programmeIds = await knex('programme')
        .insert({ name: `test programme${numberFromTo(1, 10000)}` })
        .returning('programmeId');
    const studyfieldIds = await knex('studyfield')
        .insert({ name: 'test studyfield', programmeId: programmeIds[0] })
        .returning('studyfieldId');
    const agreementIds = await knex('agreement')
        .insert({ authorId, thesisId: thesisIds[0], studyfieldId: studyfieldIds[0] })
        .returning('agreementId');
    if (personId && roleId) {
        const personRoleIds = await knex('personWithRole')
            .insert({ personId, roleId, programmeId: programmeIds[0] })
            .returning('personRoleId');
        if (roleId === 5 || roleId === 6) {
            await knex('agreementPerson').insert({ agreementId: agreementIds[0], personRoleId: personRoleIds[0] });
        }
    }
    return { thesisId: thesisIds[0], title }
}

test('author can see own thesis', async (t) => {
    t.plan(2);
    const { personId: authorId } = await createPerson();
    const app = makeApp(authorId);
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId);

    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    const foundTheses = res.body;
    t.truthy(foundTheses.find(thesis => thesis.title === title),
        `thesis with title ${title} was not found in ${JSON.stringify(foundTheses)}`);
});

test('grader can see theses they are agreementPerson of', async (t) => {
    t.plan(3);
    const { personId: authorId } = await createPerson();
    const { personId: graderId } = await createPerson();
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId, graderId, 5);
    await insertThesisWithAuthorAndPersonInRole(authorId);
    await insertThesisWithAuthorAndPersonInRole(authorId);
    const app = makeApp(graderId);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('supervisor can see theses they are agreementPerson of', async (t) => {
    t.plan(3);
    const { personId: authorId } = await createPerson();
    const { personId: supervisorId } = await createPerson();
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId, supervisorId, 6);
    await insertThesisWithAuthorAndPersonInRole(authorId);
    await insertThesisWithAuthorAndPersonInRole(authorId);
    const app = makeApp(supervisorId);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
})

test('resp prof can see programme thesis', async (t) => {
    t.plan(3);
    const { personId: authorId } = await createPerson();
    const { personId: respProfId } = await createPerson();
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId, respProfId, 4);
    const app = makeApp(respProfId);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('manager can see programme thesis', async (t) => {
    t.plan(3);
    const { personId: authorId } = await createPerson();
    const { personId: managerId } = await createPerson();
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId, managerId, 2);
    const app = makeApp(managerId);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('print-person can see programme thesis', async (t) => {
    t.plan(3);

    const { personId: authorId } = await createPerson();
    const { personId: printPersonId } = await createPerson();
    const { title } = await insertThesisWithAuthorAndPersonInRole(authorId, printPersonId, 3);
    const app = makeApp(printPersonId);
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200)

    t.is(res.body.length, 1);
    t.is(res.body[0].title, title);
});

test('admin can see all theses', async (t) => {
    t.plan(7);
    const { personId: authorId } = await createPerson();
    const { personId: author2Id } = await createPerson();
    const { personId: respProfId } = await createPerson();
    const { personId: supervisorId } = await createPerson();
    const { personId: adminId } = await createAdmin();

    const theses = await Promise.all([
        await insertThesisWithAuthorAndPersonInRole(authorId),
        await insertThesisWithAuthorAndPersonInRole(authorId, respProfId, 4),
        await insertThesisWithAuthorAndPersonInRole(authorId, supervisorId, 6),
        await insertThesisWithAuthorAndPersonInRole(author2Id),
        await insertThesisWithAuthorAndPersonInRole(author2Id, respProfId, 4),
        await insertThesisWithAuthorAndPersonInRole(author2Id, supervisorId, 6)
    ])

    const app = makeApp(adminId)
    const res = await request(app).get('/theses');
    t.is(res.status, 200)

    const foundTheses = res.body;
    theses.map(thesis => thesis.title).forEach((title) => {
        t.truthy(foundTheses.find(thesis => thesis.title === title),
            `Title ${title} was not found in ${JSON.stringify(foundTheses)}`)
    })
});

test.serial('invalid thesis is not accepted and has does not modify database', async (t) => {
    t.plan(3);
    const thesesBefore = await knex('thesis');
    const agreementsBefore = await knex('agreement');

    const data = {
        grade: '4'
    };

    const { personId: adminId } = await createAdmin();
    const app = makeApp(adminId)

    const res = await request(app)
        .post('/theses')
        .field('json', JSON.stringify(data));

    t.is(res.status, 500);

    const thesesAfter = await knex('thesis');
    const agreementsAfter = await knex('agreement');

    t.deepEqual(thesesBefore, thesesAfter);
    t.deepEqual(agreementsBefore, agreementsAfter)
});

test('thesis is validated when updated', async (t) => {
    t.plan(1);
    const { personId: adminId } = await createAdmin();

    const thesis = {
        title: 'Annin Grady',
        urkund: 'https://example.com',
        grade: '4',
        printDone: false
    };
    const thesisIds = await knex('thesis')
        .insert(thesis)
        .returning('thesisId');

    const update = {
        thesisId: thesisIds[0],
        title: '',
        urkund: '',
        grade: '',
        printDone: false
    };

    const app = makeApp(adminId)
    const res = await request(app)
        .put('/theses')
        .send(update);

    t.is(res.status, 500);
});

test('thesis can be updated', async (t) => {
    t.plan(2);
    const { personId: authorId } = await createPerson();
    const { personId: graderId } = await createPerson();
    const { personId: adminId } = await createAdmin();

    const { thesisId } = await insertThesisWithAuthorAndPersonInRole(authorId, graderId, 5);

    const newGrader = await createPerson();
    const newTitle = 'New name';
    const update = {
        thesisId,
        title: newTitle,
        graders: [newGrader]
    };

    const app = makeApp(adminId);
    const res = await request(app)
        .put('/theses')
        .send(update);

    t.is(res.status, 200);

    const thesisFromDb = await knex('thesis').select().where('thesisId', thesisId).first();

    t.is(thesisFromDb.title, newTitle);
});

test('thesis edit access is checked', async (t) => {
    t.plan(1);
    const { personId: authorId } = await createPerson();
    const { personId: graderId } = await createPerson();
    const { thesisId, title } = await insertThesisWithAuthorAndPersonInRole(authorId, graderId, 5);

    const newGrader = await createPerson();
    const update = {
        thesisId,
        title: 'New name',
        graders: [newGrader]
    };

    const app = makeApp(authorId)
    await request(app)
        .put('/theses')
        .send(update);

    const thesis = await knex('thesis').select().where('thesisId', thesisId).first();

    t.is(title, thesis.title);
});

test('mark thesis printed', async (t) => {
    t.plan(2);
    const { personId: authorId } = await createPerson();
    const { personId: printPersonId } = await createPerson();
    const { thesisId } = await insertThesisWithAuthorAndPersonInRole(authorId, printPersonId, 3);

    const app = makeApp(printPersonId)
    const res = await request(app)
        .put('/theses/printed')
        .send([thesisId])

    t.is(res.status, 200)
    const thesisAfter = await knex('thesis').select().where('thesisId', thesisId).first()
    t.true(thesisAfter.printDone)
});
