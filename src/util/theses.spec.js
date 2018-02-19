import test from 'ava'

import { formatTheses, combineAllThesisData } from './theses'

test('Thesis formatter finds correct names to thesis', (t) => {
    const theses = [{ thesisId: 1, title: 'The Gradu' }]
    const persons = [{ personId: 2, firstname: 'First', lastname: 'Last' }]
    const agreements = [{ agreementId: 3, thesisId: 1, authorId: 2 }]

    const formattedTheses = formatTheses(theses, agreements, persons)

    t.is(formattedTheses[0].authorFirstname, 'First')
    t.is(formattedTheses[0].authorLastname, 'Last')
})

test('Thesis formatter finds email to thesis without person', (t) => {
    const theses = [{ thesisId: 1, title: 'The Gradu' }]
    const persons = [{ personId: 2, firstname: 'First', lastname: 'Last' }]
    const agreements = [{ agreementId: 3, thesisId: 1, authorId: undefined, email: 'test@example.com' }]

    const formattedTheses = formatTheses(theses, agreements, persons)

    t.is(formattedTheses[0].authorEmail, 'test@example.com')
})

test('Theis data can be combined from state fields', (t) => {
    const state = {
        theses: [{ thesisId: 1, councilmeetingId: 5 }],
        agreements: [{ agreementId: 2, studyfieldId: 3, thesisId: 1, authorId: 20 }],
        persons: [{ personId: 20, name: 'Author' }, { personId: 21, name: 'Grader' }],
        studyfields: [{ studyfieldId: 3, programmeId: 4, name: 'studyfield' }],
        programmes: [{ programmeId: 4, name: 'programme' }],
        roles: [{ agreementId: 2, personId: 21, name: 'grader' }],
        councilMeetings: [{ councilmeetingId: 5 }],
        attachments: [{ attachmentId: 6, agreementId: 2 }],
        user: { personId: 20, roles: [] }
    }

    const thesisData = combineAllThesisData(1, state)

    t.is(thesisData.thesis.thesisId, 1)
    t.is(thesisData.agreement.agreementId, 2)
    t.is(thesisData.author.name, 'Author')
    t.is(thesisData.graders[0].name, 'Grader')
    t.is(thesisData.thesisAttachments.length, 1)
    t.is(thesisData.councilMeeting.councilmeetingId, 5)
    t.is(thesisData.allowEdit, false)
})
