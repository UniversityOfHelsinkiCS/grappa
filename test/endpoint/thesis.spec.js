import test from 'ava';
const request = require('supertest');
const express = require('express');
const theses = require('../../src/routes/theses');
const config = require('../../src/db/knexfile');

const makeApp = () => {
    const app = express();
    app.use('/theses', theses)
    return app;
}

test.before(async t => {
    //TODO: Fix this waiting.
    //Waiting for migrations to finish (in db/connection.js )
    const waitString = await new Promise(r => setTimeout(r, 500)).then(() => { return "Waited" })
    //console.log(waitString);
})

const thesisWithoutId = {
    thesisTitle: "Annin Grady",
    startDate: "6.5.2005",
    completionEta: "1.2.2006",
    performancePlace: "Hima",
    urkund: "https://",
    grade: "4",
    graderEval: "Tarkastajien esittely",
    userId: 1,
    printDone: 0
}

test('thesis post & creates id', async t => {
    t.plan(12);    
    const res = await request(makeApp())
        .post('/theses')
        .field('json', JSON.stringify(thesisWithoutId))
    t.is(res.status, 200);
    const body = res.body;
    let thesis = thesisWithoutId;
    thesis.thesisId = 1;
    Object.keys(thesis).forEach(key => {
        t.is(thesis[key], body[key], "Key: " + key)
    })
    t.is(Object.keys(thesis).length, Object.keys(body).length, "Key length");
})

test('thesis get all', async t => {
    t.plan(13);
    const app = makeApp();
    const res = await request(app)
        .get('/theses');
    t.is(res.status, 200);
    const body = res.body;
    const bodyThesis = body[0]
    let thesis = thesisWithoutId;
    thesis.thesisId = 1;
    const theses = [thesis];
    Object.keys(thesis).forEach(key => {
        t.is(thesis[key], bodyThesis[key], "Key: " + key)
    })
    t.is(Object.keys(thesis).length, Object.keys(bodyThesis).length, "Key length");
    t.is(body.length, theses.length);

})