require('babel-polyfill');
const attachmentService = require('../services/AttachmentService');
const fileService = require('../services/FileService');
const express = require('express');
const Busboy = require('busboy');
const app = express();
const fs = require('fs');

export async function saveAttachment(req, res) {
    console.log("controller")
    console.log("req.params", req.params);
    try {
        let busboy = new Busboy({ headers: req.headers });
        console.log(1)
        busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
            console.log("busboy")
            const attachmentData = {
                //agreementId: req.params.id, won't work atm since req.params doesn't have anything
                
                agreementId: 1,
                savedOnDisk: false,
                filename: filename,
                type: mimetype
            };
            console.log(2)
            const attachmentId = await attachmentService.saveAttachment(attachmentData);
            const fileResponse = await fileService.savePdfFile(file, attachmentId);
            console.log("fileres", fileResponse)
            if (fileResponse) {
                let successData = {
                    attachmentId: attachmentId,
                    savedOnDisk: true
                };
                const attachmentResponse = await attachmentService.updateAttachment(successData);
            } else {
                res.status(500).json({ text: "could not save file" });
            }
        });
        console.log("attachmentcontroller says 200");
        res.status(200).json({ text: "attachment save successful" });
        return req.pipe(busboy);
    } catch (error) {
        console.log("attachment controller says 500 :(")
        res.status(500).json({ text: "error occured", error: error });
    }
}
