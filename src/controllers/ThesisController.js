const thesisService = require('../services/ThesisService');
const agreementService = require('../services/AgreementService');
const attachmentService = require('../services/AttachmentService');

export async function getAllTheses(req, res) {
    const theses = await thesisService.getAllTheses();
    res.status(200).json(theses);
}

export async function getThesisById(req, res) {
    const thesis = await thesisService.getThesisById(req.params.id);
    res.status(200).json(thesis);
}

export async function saveThesis(req, res) {
    const data = req.body;
    try {
        const thesis = await thesisService.saveThesis(data);
        const agreement = await agreementService.createFakeAgreement(thesis.thesisId);
        await attachmentService.saveAttachments(req, res, agreement.agreementId);
        const attachments = await attachmentService.getAttachmentsForAgreement(agreement.agreementId)
        console.log(attachments);
        res.status(200).json(thesis);
    } catch (error) {
        res.status(500).json(error);
    }
}