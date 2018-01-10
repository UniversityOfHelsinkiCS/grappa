const mailer = require('../util/mailer');

const emailDraftService = require('../services/EmailDraftService');
const personService = require('../services/PersonService');

export async function newThesisAddedNotifyAuthor(email, studyfieldId) {
    await sendMail('ThesisAuthorNotification', email, studyfieldId);
}

export async function newThesisAddedNotifyRespProf(studyfieldId) {
    const respProfs = await personService.getPersonsWithRoleInStudyfield(4, studyfieldId);
    const mails = respProfs.map(prof => sendMail('SupervisingProfessorNotification', prof.email, studyfieldId));

    return Promise.all(mails);
}

async function sendMail(type, email, studyfieldId) {
    const emailDraft = await emailDraftService.getEmailDraft(type, studyfieldId);

    try {
        await mailer.sendEmail(email, emailDraft.title, emailDraft.body);
    } catch (error) {
        console.error('Email send error', error);
    }
}
