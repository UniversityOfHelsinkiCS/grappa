import test from 'ava'

process.env.DB_SCHEMA = 'agreement_test'

const { initDb, makeTestApp } = require('../utils')

const request = require('supertest')
const agreement = require('../../src/routes/agreements')

const makeApp = async userId => makeTestApp('/agreements', userId, agreement)

test.before(async () => {
    await initDb()
})

test('agreements get should also return attachments', async (t) => {
    t.plan(3)
    const res = await request(await makeApp(10))
        .get('/agreements')
    t.is(res.status, 200)
    const { agreements } = res.body
    const { attachments } = res.body
    t.is(agreements.length, 1)
    t.is(attachments.length, 1)
})
