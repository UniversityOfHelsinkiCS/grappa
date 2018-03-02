import test from 'ava'
import { initDb, createToken } from '../utils'

process.env.DB_SCHEMA = 'agreement_test'

const request = require('supertest')
const express = require('express')
const agreement = require('../../src/routes/agreements')
const errorHandler = require('../../src/util/errorHandler')

const makeApp = (userId) => {
    const app = express()
    app.use('/agreements', (req, res, next) => {
        req['x-access-token'] = createToken(userId)
        req.decodedToken = { userId }
        next()
    }, agreement)

    app.use(errorHandler)

    return app
}

test.before(async () => {
    await initDb()
})

const agreementForm = {
    thesisTitle: 'my Thesis',
    thesisStartDate: '9.9.2017',
    thesisCompletionEta: '9.9.2018',
    thesisPerformancePlace: 'helsinki',

    thesisSupervisorMain: 'matti luukkainen',
    thesisSupervisorSecond: 'sauli niinnistö',
    thesisSupervisorOther: '',

    thesisWorkStudentTime: '1h viikossa',
    thesisWorkSupervisorTime: '2h viikossa',
    thesisWorkIntermediateGoal: 'vain taivas on rajana',
    thesisWorkMeetingAgreement: 'joka toinen viikko',
    thesisWorkOther: '',

    studentGradeGoal: '5',

    studyfieldId: 1,
    fake: false,
    studentWorkTime: '1h viikossa',
    supervisorWorkTime: '2h viikossa',
    intermediateGoal: '20 sivua ensi perjantaina',
    meetingAgreement: 'Jepsis',
    other: 'eihän tässä muuta',
    whoNext: 'supervisor'
}

const agreementWithId = {
    agreementId: 1,
    authorId: 1,
    thesisId: 1,
    responsibleSupervisorId: 1,
    studyfieldId: 1,
    fake: 0,
    studentGradeGoal: 5,
    studentWorkTime: '1h viikossa',
    supervisorWorkTime: 'tsiigaillaan',
    intermediateGoal: 'oispa valmistunut',
    meetingAgreement: 'just just',
    other: 'eihän tässä muuta'
}

// TODO: Test something like thesis: thesisForm post & creates id without attachment
test.skip('agreement post & correct response', async (t) => {
    t.plan(2)
    const res = await request(makeApp())
        .post('/agreements')
        .send(agreementForm)
    t.is(res.status, 200)
    const thesis = res.body.thesis
    const author = res.body.author
    const agreement = res.body.agreement
})

test('agreements get should also return attachments', async (t) => {
    t.plan(3)
    const res = await request(makeApp(10))
        .get('/agreements')
    t.is(res.status, 200)
    const agreements = res.body.agreements
    const attachments = res.body.attachments
    t.is(agreements.length, 1)
    t.is(attachments.length, 1)
})
