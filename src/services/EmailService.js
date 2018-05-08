import logger from '../util/logger'

const mailer = require('../util/mailer')

const emailDraftService = require('../services/EmailDraftService')
const personService = require('../services/PersonService')

const PROD_ADDRESS = 'https://grappa.cs.helsinki.fi/v2/'
const DEV_ADDRESS = 'http://localhost:3000/v2/'

const SERVER_ADDRESS = process.env.NODE_ENV === 'production' ? PROD_ADDRESS : DEV_ADDRESS

export async function newThesisAddedNotifyRespProf(programmeId) {
    const respProfs = await personService.getPersonsWithRoleInStudyfield(4, programmeId)
    const mails = respProfs.map(prof => sendMail('SupervisingProfessorNotification', prof.email, programmeId))

    return Promise.all(mails)
}

async function sendMail(type, email, programmeId) {
    const emailDraft = await emailDraftService.getEmailDraft(type, programmeId)

    try {
        await mailer.sendEmail(email, emailDraft.title, emailDraft.body)
    } catch (error) {
        logger.error('Email send error', { error: error.message })
    }
}

export async function sendInvite(emailInvite, type, programmeId) {
    const draftName = type === 'role' ? 'InviteRoleToLogin' : 'InviteAuthorToLogin'
    const draft = await emailDraftService.getEmailDraft(draftName, programmeId)
    const body = draft.body.replace('$LOGIN_URL$', `${SERVER_ADDRESS}invite?type=${type}&token=${emailInvite.token}`)

    try {
        await mailer.sendEmail(emailInvite.email, draft.title, body)
    } catch (error) {
        logger.error('Email send error', { error: error.message })
    }
}

export const sendRoleRequestNotification = async (address, roleName, granted, granterName, programmeName) => {
    const title = 'Notification from Grappa'
    const body = `You have ${granted ? '' : 'NOT'} been granted the following role to Grappa:\n 
    ${roleName} in ${programmeName}\n
    The request was handled by ${granterName}. Please contact them for any further information.`
    try {
        await mailer.sendEmail(address, title, body)
    } catch (error) {
        logger.error('Email send error', { error: error.message })
    }
}