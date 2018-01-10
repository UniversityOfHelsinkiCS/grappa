const mailer = require('../util/mailer');

const emailDraftService = require('../services/EmailDraftService');
const personService = require('../services/PersonService');

export async function newThesisAddedNotifyAuthor(personId, studyfieldId) {
    await sendMail('ThesisAuthorNotification', personId, studyfieldId);
}

export async function newThesisAddedNotifyRespProf(personId, studyfieldId) {
    await sendMail('SupervisingProfessorNotification', personId, studyfieldId);
}

async function sendMail(type, personId, studyfieldId) {
    const emailDraft = await emailDraftService.getEmailDraft(type, studyfieldId);
    const person = await personService.getPersonById(personId);

    try {
        await mailer.sendEmail(person.email, emailDraft.title, emailDraft.body);
    } catch (error) {
        console.error('Email send error', error);
    }
}
