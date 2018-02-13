import { checkUserIsAdminOrManager } from '../services/RoleService'

const emailDraftService = require('../services/EmailDraftService')
const notificationService = require('../services/NotificationService')

export async function getEmailDrafts(req, res) {
    await checkUserIsAdminOrManager(req)
    const emailDrafts = await emailDraftService.getEmailDrafts()
    res.status(200).json(emailDrafts).end()
}

export async function saveEmailDraft(req, res) {
    await checkUserIsAdminOrManager(req)
    const emailDraftId = await emailDraftService.saveEmailDraft(req.body)
    const emailDraft = await emailDraftService.getEmailDraftById(emailDraftId)
    await notificationService.createNotification('EMAILDRAFT_SAVE_ONE', req)
    res.status(200).json(emailDraft).end()
}

export async function updateEmailDraft(req, res) {
    await checkUserIsAdminOrManager(req)
    const emailDraftId = await emailDraftService.updateEmailDraft(req.params.id, req.body)
    const emailDraft = await emailDraftService.getEmailDraftById(emailDraftId)
    await notificationService.createNotification('EMAILDRAFT_UPDATE_ONE', req)
    res.status(200).json(emailDraft).end()
}

export async function deleteEmailDraft(req, res) {
    await checkUserIsAdminOrManager(req)
    await emailDraftService.deleteEmailDraft(req.params.id)
    await notificationService.createNotification('EMAILDRAFT_DELETE_ONE', req)
    res.status(200).json(req.params.id).end()
}
