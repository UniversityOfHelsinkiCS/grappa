const attachmentService = require('../services/AttachmentService');
const notificationService = require('../services/NotificationService');

export async function saveAttachments(req, res) {
    try {
        const attachmentObject = await attachmentService.saveAttachments(req, res);
        const attachments = attachmentObject.attachments;
        notificationService.createNotification('ATTACHMENT_SAVE_ONE_SUCCESS', req);
        res.status(200).send(attachments).end();
    } catch (error) {
        res.status(500).end();
    }
}

export async function downloadAttachments(req, res) {
    try {
        const attachmentIds = req.params.ids.split('&');
        const attachments = await attachmentService.getAttachments(attachmentIds);

        //To keep the order that was used to call (eq, 3&1&2)
        let order = {};
        attachmentIds.forEach((a, i) => { order[a] = i; });
        attachments.sort((a, b) => order[a.attachmentId] - order[b.attachmentId]);

        const fileStream = await attachmentService.mergeAttachments(attachments);

        res.type('pdf');
        res.end(fileStream, 'binary');
    } catch (error) {
        console.log("error", error);
        res.status(501).send({ text: 'NOT YET IMPLEMENTED' }).end();
    }
}

export async function deleteAttachment(req, res) {
    try {
        const attachmentId = req.params.id;
        const deletedId = await attachmentService.deleteAttachment(attachmentId);
        res.status(200).send(deletedId).end();
    } catch (error) {
        res.status(500).end();
    }
}