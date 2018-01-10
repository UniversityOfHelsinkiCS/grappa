const emailDraftService = require('../services/EmailDraftService');
const notificationService = require('../services/NotificationService');

export async function getEmailDrafts(req, res) {
    const emailDrafts = await emailDraftService.getEmailDrafts();
    res.status(200).json(emailDrafts).end();
}

export async function saveEmailDraft(req, res) {
    try {
        const emailDraftId = await emailDraftService.saveEmailDraft(req.body);
        const emailDraft = await emailDraftService.getEmailDraftById(emailDraftId);
        await notificationService.createNotification('EMAILDRAFT_SAVE_ONE', req);
        res.status(200).json(emailDraft).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export async function updateEmailDraft(req, res) {
    try {
        const emailDraftId = await emailDraftService.updateEmailDraft(req.params.id, req.body);
        const emailDraft = await emailDraftService.getEmailDraftById(emailDraftId);
        await notificationService.createNotification('EMAILDRAFT_UPDATE_ONE', req);
        res.status(200).json(emailDraft).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}

export async function deleteEmailDraft(req, res) {
    try {
        await emailDraftService.deleteEmailDraft(req.params.id);
        await notificationService.createNotification('EMAILDRAFT_DELETE_ONE', req);
        res.status(200).json(req.params.id).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}
