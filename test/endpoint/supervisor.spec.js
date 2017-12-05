import test from 'ava';
const request = require('supertest');
const express = require('express');
const supervisors = require('../../src/routes/supervisors');
const config = require('../../knexfile');

const makeApp = () => {
    const app = express();
    app.use('/supervisors', supervisors)
    return app;
}

test.beforeEach(async t => {
    const knex = require('knex')(config['test']);
    await knex.migrate.rollback().then(() => {
        //console.log("Rollback happened")
        return;
    }).catch(err => {
        console.log(err);
    })
})

const supervisorWithoutId = {
    firstname: "Testi",
    lastname: "Testinen",
    email: "",
    address: "",
    title: "",
    shibbolethId: "",

    /*agreementId: 1,
    approvalDate: null,
    approved: 1,
    approverId: 2,
    created_at: null,
    email: "",
    isRetired: 0,
    major: "",
    personId: 1,
    personRoleId: 1,
    phone: "",
    roleId: 1,
    statement: "",
    studentNumber: "",
    studyfieldId: 1,
    updated_at: null
    */
}

const supervisorWithId = {
    firstname: "Testi",
    lastname: "Testinen",
    id: 1
}

test('supervisor post & creates id', async t => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/supervisors/save')
        .send(supervisorWithoutId);
    t.is(res.status, 200);
    const body = res.body;
    const supervisor = supervisorWithId;
    console.log(JSON.stringify(body), JSON.stringify(supervisor));
    t.is(JSON.stringify(body), JSON.stringify(supervisor));
})

test.skip('councilmeeting get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/councilmeetings');
    t.is(res.status, 200);
    const body = res.body;
    const meetings = [ councilmeetingWithId ];
    t.is(JSON.stringify(body), JSON.stringify(meetings));    
})