const attachmentService = require('../services/AttachmentService');
const notificationService = require('../services/NotificationService');

export async function saveAttachments(req, res) {
    try {
        const attachmentObject = await attachmentService.saveAttachments(req, res);
        const attachments = attachmentObject.attachments;
        notificationService.createNotification('AGREEMENT_SAVE_ONE_SUCCESS', req);
        res.status(200).send(attachments).end();
    } catch (error) {
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end();
    }
}

export async function downloadAttachments(req, res) {
    try {
        const attachmentIds = req.params.ids.split('&');
        const attachments = await attachmentService.getAttachments(attachmentIds);
        const pathToFile = await attachmentService.mergeAttachments(attachments, "merged.pdf");
        
        res.type('pdf');
        res.end(pathToFile, 'binary');
    } catch (error) {
        console.log("error", error);
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end();
    }
}

export async function deleteAttachment(req, res) {
    try {
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end();
    } catch (error) {
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end();
    }
}