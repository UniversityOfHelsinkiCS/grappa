const emailDraftService = require('../services/EmailDraftService');

export async function getEmailDrafts(req, res) {
    return emailDraftService.saveEmailDraft();
}
