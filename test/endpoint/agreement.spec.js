import test from 'ava'

process.env.DB_SCHEMA = 'agreement_test'

const { initDb, makeTestApp } = require('../utils')

const request = require('supertest')
const agreement = require('../../src/routes/agreements')

const makeApp = async (userId) => {
    return makeTestApp('/agreements', userId, agreement)
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
test('agreements get should also return attachments', async (t) => {
    t.plan(3)
    const res = await request(await makeApp(10))
        .get('/agreements')
    t.is(res.status, 200)
    const agreements = res.body.agreements
    const attachments = res.body.attachments
    t.is(agreements.length, 1)
    t.is(attachments.length, 1)
})
