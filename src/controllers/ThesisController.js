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
        // Order so that agreementId is available to save attachments.
        // Attachmentservice gives back the parsed multipart formdata
        let agreement = await agreementService.createFakeAgreement();
        const attachmentObject = await attachmentService.saveAttachments(req, res, agreement.agreementId);
        const attachments = attachmentObject.attachments;
        const thesis = attachmentObject.json;
        const savedThesis = await thesisService.saveThesis(thesis);
        // Agreement was missing the thesisId completing linking.
        agreement.thesisId = savedThesis.thesisId;
        agreement = await agreementService.updateAgreement(agreement)

        res.status(200).json(savedThesis);
    } catch (error) {
        res.status(500).json(error);
    }
}