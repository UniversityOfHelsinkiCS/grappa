const emailDraftService = require('../services/EmailDraftService');

export async function getEmailDrafts(req, res) {
    const emailDrafts = await emailDraftService.getEmailDrafts();
    res.status(200).json(emailDrafts).end();
}

export async function updateEmailDraft(req, res) {
    try {
        await emailDraftService.updateEmailDraft(req.params.id, req.body);
        res.status(200).end();
    } catch (error) {
        console.log(error);
        res.status(500).end();
    }
}
