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

export async function sendInvite(emailInvite) {
    const draft = await emailDraftService.getEmailDraft('InviteAuthorToLogin');
    const body = draft.body.replace('$LOGIN_URL$', `http://localhost:3000/v2/invite/${emailInvite.token}`);

    try {
        await mailer.sendEmail(emailInvite.email, draft.title, body);
    } catch (error) {
        console.error('Email send error', error);
    }
}
