import test from 'ava';
const request = require('supertest');
const express = require('express');
const supervisors = require('../../src/routes/supervisors');
const roleService = require('../../src/services/RoleService');
const config = require('../../src/db/knexfile');

const makeApp = () => {
    const app = express();
    app.use('/supervisors', (req, res, next) => {
        req.session = {};
        req.session.user_id = 1;
        next();
    }, supervisors)
    return app;
}

test.before(async t => {
    const knex = require('knex')(config['test']);
    await knex.migrate.rollback().then(() => {
        //console.log("Rollback happened")
        return;
    }).catch(err => {
        //console.log(err);
    })
    roleService.saveRole("supervisor");
})

const supervisorWithoutId = {
    firstname: "Testi",
    lastname: "Testinen",
    email: "",
    address: "",
    title: "",
    shibbolethId: "",

    /*  agreementId: 1,
      approvalDate: null,
      approved: 1,
      approverId: 2,
      created_at: null,
      isRetired: 0,
      major: "",
      personId: 1,
      personRoleId: 1,
      phone: "",
      roleId: 1,
      statement: "",
      studentNumber: "",
      studyfieldId: 1,
      updated_at: null*/

}

const supervisorWithId = {
    firstname: "Testi",
    lastname: "Testinen",
    id: 1
}

test('supervisor post & creates id', async t => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/supervisors/')
        .send(supervisorWithoutId);
    t.is(res.status, 200);
    const body = res.body;
    t.is(body.personId, 1);
})

test.skip('councilmeeting get all', async t => {
    t.plan(2);
    const app = makeApp();
    const res = await request(app)
        .get('/councilmeetings');
    t.is(res.status, 200);
    const body = res.body;
    const meetings = [councilmeetingWithId];
    t.is(JSON.stringify(body), JSON.stringify(meetings));
})