import test from 'ava'

process.env.DB_SCHEMA = 'statistics_test'

const { initDb, makeTestApp } = require('../utils')
const request = require('supertest')
const statisctics = require('../../src/routes/statisctics')
const knex = require('../../src/db/connection').getKnex()


const makeApp = async id => makeTestApp('/statistics', id, statisctics)

test.before(async () => {
    await initDb()
})

test('statistics can be fetched', async (t) => {
    // Imported pre-grappa thesis
    const thesisId = await knex('thesis')
        .insert({ title: 'foo', printDone: true, grade: 'Laudatur' })
        .returning('thesisId')
    await knex('agreement')
        .insert({ thesisId: thesisId[0], studyfieldId: 1, completionEta: '2017-07-07' })

    // Grappa thesis
    const councilmeeting = await knex('councilmeeting').insert({ date: '2017-04-04' }).returning('councilmeetingId')
    const thesisId2 = await knex('thesis')
        .insert({ title: 'bar', printDone: true, grade: 'Lubenter Approbatur', councilmeetingId: councilmeeting[0] })
        .returning('thesisId')
    await knex('agreement').insert({ thesisId: thesisId2[0], studyfieldId: 1 })
    await knex('meetingProgramme').insert({ councilmeetingId: councilmeeting[0], programmeId: 1 })

    const res = await request(await makeApp(1)).get('/statistics')

    const expectedResponse = {
        2017: {
            1: {
                1: {
                    newGrades: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                    oldGrades: {
                        Approbatur: 0,
                        'Lubenter Approbatur': 1,
                        'Non Sine Laude Approbatur': 0,
                        'Cum Laude Approbatur': 0,
                        'Magna Cum Laude Approbatur': 0,
                        'Eximia Cum Laude Approbatur': 0,
                        Laudatur: 1
                    }
                }
            }
        }
    }

    t.is(res.status, 200)
    t.deepEqual(res.body, expectedResponse, 'invalid response')
})
