const attachmentService = require('../services/AttachmentService');

export async function saveAttachments(req, res) {
    try {
        const attachmentObject = await attachmentService.saveAttachments(req, res)
        const attachments = attachmentObject.attachments;
        res.status(200).send(attachments).end();
    } catch (error) {
        res.status(404).send({ text: "NOT YET IMPLEMENTED" }).end();
    }
}
