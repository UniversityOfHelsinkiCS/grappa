const emailDraftService = require('../services/EmailDraftService');

export async function getEmailDrafts(req, res) {
    const emailDrafts = await emailDraftService.getEmailDrafts();
    res.status(200).json(emailDrafts).end();
}
