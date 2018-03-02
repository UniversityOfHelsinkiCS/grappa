import test from 'ava'

process.env.DB_SCHEMA = 'studyfield_test'

const { initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const programmes = require('../../src/routes/programmes')
const mockStudyfields = require('../../src/mockdata/MockProgrammes')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async (id) => {
    const userId = (await knex.select().from('person').where('personId', id)
        .first()).shibbolethId
    return makeTestApp('/programmes', userId, programmes)
}


test.before(async () => {
    await initDb()
})

test('programme get all', async (t) => {
    t.plan(2)
    const app = await makeApp(1)
    const res = await request(app)
        .get('/programmes')

    t.is(res.status, 200)
    t.deepEqual(res.body, mockStudyfields)
})
