import test from 'ava';
const request = require('supertest');
const express = require('express');
const agreement = require('../../src/routes/agreements');
const config = require('../../knexfile');

const makeApp = () => {
    const app = express();
    app.use('/agreement', agreement)
    return app;
}

test.before(async t => {
    const knex = require('knex')(config['test']);
    await knex.migrate.rollback().then(() => {
        console.log("Rollback happened")
        return;
    }).catch(err => {
        console.log(err);
    })
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

test.skip('agreement post & creates id', async t => {
    t.plan(2);
    const res = await request(makeApp())
        .post('/agreement')
        .send(agreementWithoutId);
    t.is(res.status, 200);
    const body = res.body;
    const agreement = agreementWithId;
    t.is(JSON.stringify(body), JSON.stringify(agreement));
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
