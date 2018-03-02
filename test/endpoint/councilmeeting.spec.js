import test from 'ava'

process.env.DB_SCHEMA = 'councilmeeting_test'

const { initDb, makeTestApp, createPerson } = require('../utils')
const request = require('supertest')
const councilmeetings = require('../../src/routes/councilmeeting')
const knex = require('../../src/db/connection').getKnex()

const makeApp = async (id) => {
    const userId = (await knex.select().from('person').where('personId', id)
        .first()).shibbolethId
    return makeTestApp('/councilmeetings', userId, councilmeetings)
}

test.before(async () => {
    await initDb()
})

const numberFromTo = (from, to) => Math.round(Math.random() * (to - from)) + from

const generateCouncilMeeting = () => ({
    date: `${numberFromTo(2030, 2050)}-0${numberFromTo(1, 3)}-17T22:00:00.000Z`,
    instructorDeadline: `${numberFromTo(2000, 2020)}-0${numberFromTo(1, 3)}-10T22:00:00.000Z`,
    studentDeadline: `${numberFromTo(2000, 2020)}-0${numberFromTo(1, 3)}-03T22:00:00.000Z`,
    programmes: [1]
})

const validPost = async (t, app, data) => {
    const res = await request(app)
        .post('/councilmeetings')
        .send(data)
    t.is(res.status, 200,
        `endpoint did not accept data: ${JSON.stringify(data)}`)

    const responseMeeting = Object.assign({}, res.body)
    t.truthy(responseMeeting.councilmeetingId,
        'responseMeeting does not have id')

    delete responseMeeting.councilmeetingId
    t.deepEqual(data, responseMeeting,
        'data posted is not equal to response')
    return res.body
}

const validGet = async (t, app) => {
    const res = await request(app)
        .get('/councilmeetings')
    t.is(res.status, 200, 'get is not working')
    return res.body
}

const validDelete = async (t, app, id) => {
    const res = await request(app)
        .del(`/councilmeetings/${id}`)
    t.is(res.status, 200, 'delete is not working')
    return res.body
}

const validUpdate = async (t, app, id) => {
    const councilMeeting2 = generateCouncilMeeting()
    const res = await request(app)
        .put(`/councilmeetings/${id}`)
        .send(councilMeeting2)
    t.is(res.status, 200,
        `endpoint did not accept data: ${JSON.stringify(councilMeeting2)}`)

    const responseMeeting = Object.assign({}, res.body)
    t.truthy(responseMeeting.councilmeetingId,
        'responseMeeting does not have id')

    delete responseMeeting.councilmeetingId
    t.deepEqual(councilMeeting2, responseMeeting,
        'data put is not equal to response')
    return res.body
}

test('councilmeeting post returns the councilmeeting', async (t) => {
    t.plan(3)
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    await validPost(t, app, councilMeeting)
})

test('councilmeeting get', async (t) => {
    t.plan(7)
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)

    await validPost(t, app, councilMeeting)

    const responseMeetingArray = await validGet(t, app)

    t.truthy(responseMeetingArray.length > 0,
        `responseMeetingArray is ${typeof responseMeetingArray}, maybe its length is 0`)

    const responseMeeting = responseMeetingArray.find(meeting =>
        Object.keys(councilMeeting).find(key =>
            councilMeeting[key] === meeting[key])
    )
    t.truthy(responseMeeting,
        `councilMeeting was not found in responseMeetingArray, ${responseMeeting}`)

    delete responseMeeting.councilmeetingId
    t.deepEqual(responseMeeting, councilMeeting,
        'data posted is not equal to response')
})

test('councilmeeting delete returns id', async (t) => {
    t.plan(7)
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    const responseMeeting = await validPost(t, app, councilMeeting)
    const councilMeetingId = responseMeeting.councilmeetingId
    const response = await validDelete(t, app, councilMeetingId)
    t.is(Number(response.councilmeetingId), councilMeetingId)
    const meetings = await validGet(t, app)
    t.falsy(meetings.find(meeting => meeting.councilmeetingId === councilMeetingId),
        'Meeting was still found with get')
})

test('councilmeeting update', async (t) => {
    t.plan(10)
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    const responseMeeting = await validPost(t, app, councilMeeting)
    const councilMeetingId = responseMeeting.councilmeetingId

    const updated = await validUpdate(t, app, councilMeetingId)
    t.notDeepEqual(updated, responseMeeting)
    t.is(updated.councilmeetingId, councilMeetingId)
    const meetings = await validGet(t, app)
    const foundMeeting = meetings.find(meeting => meeting.councilmeetingId === councilMeetingId)
    t.deepEqual(foundMeeting, updated)
})


test.serial('councilmeeting with invalid data cannot be created', async (t) => {
    t.plan(6)
    const app = await makeApp(1)
    const getBefore = await validGet(t, app)

    const badMeeting1 = {
        date: '2017-02-31T22:00:00.000Z', // Invalid date
        instructorDeadline: '2016-01-10T22:00:00.000Z',
        studentDeadline: '2016-01-03T22:00:00.000Z',
        programmes: [1]
    }

    const badMeeting2 = {
        date: '2015-02-15T22:00:00.000Z', // Date before deadlines
        instructorDeadline: '2016-01-10T22:00:00.000Z',
        studentDeadline: '2016-01-03T22:00:00.000Z',
        programmes: [1]
    }

    const badMeeting3 = {
        date: '2017-02-15T22:00:00.000Z',
        instructorDeadline: '2016-01-10T22:00:00.000Z',
        studentDeadline: '2016-01-03T22:00:00.000Z',
        programmes: [143729] // Invalid programme
    }
    const responses = await Promise.all([
        request(app)
            .post('/councilmeetings')
            .send(badMeeting1),
        request(app)
            .post('/councilmeetings')
            .send(badMeeting2),
        request(app)
            .post('/councilmeetings')
            .send(badMeeting3)
    ])
    responses.forEach((response, index) => {
        t.is(response.status, 500,
            `Response wasn't 500 at request number ${index}`)
    })

    const getAfter = await validGet(t, app)
    t.deepEqual(getBefore, getAfter)
})

test('meeting with theses cant be deleted', async (t) => {
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    const meeting = await validPost(t, app, councilMeeting)
    const meetingId = meeting.councilmeetingId

    await knex('thesis').insert({ title: 'foo', councilmeetingId: meetingId, grade: '3' })

    const res = await request(app).del(`/councilmeetings/${meetingId}`)

    t.is(res.status, 500)
})

test('normal people can\'t create meetings', async (t) => {
    const person = await createPerson('email@here.com')
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(person.personId)

    const res = await request(app)
        .post('/councilmeetings')
        .send(councilMeeting)
    t.is(res.status, 500)
})

test('normal people can\'t edit meetings', async (t) => {
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    const responseMeeting = await validPost(t, app, councilMeeting)
    const councilMeetingId = responseMeeting.councilmeetingId

    const person = await createPerson('normal1234@example.com')
    const app2 = await makeApp(person.personId)

    const res = await request(app2)
        .put(`/councilmeetings/${councilMeetingId}`)
        .send(councilMeeting)
    t.is(res.status, 500)
})

test('normal people can\'t delete meetings', async (t) => {
    const councilMeeting = generateCouncilMeeting()
    const app = await makeApp(1)
    const responseMeeting = await validPost(t, app, councilMeeting)
    const councilMeetingId = responseMeeting.councilmeetingId

    const person = await createPerson('normal4321@example.com')
    const app2 = await makeApp(person.personId)

    const res = await request(app2)
        .del(`/councilmeetings/${councilMeetingId}`)
    t.is(res.status, 500)
})
