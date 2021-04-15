import test from 'ava'

process.env.DB_SCHEMA = 'emaildraft_test'

const { initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const emailDrafts = require('../../src/routes/emailDrafts')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async id => makeTestApp('/emailDrafts', id, emailDrafts)

test.before(async () => {
    await initDb()
})

test('emailDrafts get all', async (t) => {
    t.plan(3)
    const res = await request(await makeApp(1)).get('/emailDrafts')
    t.is(res.status, 200)
    const drafts = res.body
    t.truthy(drafts.length > 0)
    t.truthy(drafts[0].type)
})

test('emailDraft update', async (t) => {
    const emailDraft = await knex.insert({ type: 'endpointTestUpdate', title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId')
    const draftId = emailDraft[0]

    const res = await request(await makeApp(1))
        .post(`/emailDrafts/${draftId}`)
        .send({ title: 'test title', body: 'test body' })

    t.is(res.status, 200)
})

test('emailDraft save', async (t) => {
    const res = await request(await makeApp(1))
        .post('/emailDrafts')
        .send({ type: 'endpointTest', title: 'test title', body: 'test body' })

    t.is(res.status, 200)
    t.truthy(res.body.emailDraftId)
})

test('emailDraft delete', async (t) => {
    const emailDraft = await knex.insert({ type: 'endpointTestDelete', title: 'foo', body: 'bar' })
        .into('emailDraft')
        .returning('emailDraftId')
    const draftId = emailDraft[0]
    const res = await request(await makeApp(1))
        .delete(`/emailDrafts/${draftId}`)

    t.is(res.status, 200)
})

test('programme is saved', async (t) => {
    const res = await request(await makeApp(1))
        .post('/emailDrafts')
        .send({ type: 'endpointTest', title: 'test title', body: 'test body', programme: 1 })

    t.is(res.status, 200)
    const emailDraftId = res.body.emailDraftId

    const draft = await knex('emailDraft').select().where('emailDraftId', emailDraftId).first()
    t.is(draft.programme, 1)
})
