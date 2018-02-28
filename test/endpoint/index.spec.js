import test from 'ava'
import { initDb, makeTestApp } from '../utils'

process.env.DB_SCHEMA = 'index_test'

const request = require('supertest')
const index = require('../../src/routes/index')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async (id) => {
    const userId = (await knex.select().from('person').where('personId', id)
        .first()).shibbolethId
    return makeTestApp('/', userId, index)
}

test.before(async () => {
    await initDb()
})

test('Initial test', async (t) => {
    t.plan(1)
    const app = makeApp(1)
    const res = await request(app)
        .get('/')
    t.is(res.status, 200)
})
