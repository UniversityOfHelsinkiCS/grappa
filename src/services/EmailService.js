const mailer = require('../util/mailer');

const emailDraftService = require('../services/EmailDraftService');
const personService = require('../services/PersonService');

export async function newThesisAddedNotifyAuthor(email, studyfieldId) {
    await sendMail('ThesisAuthorNotification', email, studyfieldId);
}

export async function newThesisAddedNotifyRespProf(personId, studyfieldId) {
    const person = await personService.getPersonById(personId);
    await sendMail('SupervisingProfessorNotification', person.email, studyfieldId);
}

async function sendMail(type, email, studyfieldId) {
    const emailDraft = await emailDraftService.getEmailDraft(type, studyfieldId);

    try {
        await mailer.sendEmail(email, emailDraft.title, emailDraft.body);
    } catch (error) {
        console.error('Email send error', error);
    }
}
