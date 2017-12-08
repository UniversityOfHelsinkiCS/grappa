require('babel-polyfill');
const attachmentService = require('../services/AttachmentService');
const fileService = require('../services/FileService');
const express = require('express');
const Busboy = require('busboy');
//const app = express();
const fs = require('fs');

export async function saveAttachment(req, res) {
    try {
        let busboy = new Busboy({ headers: req.headers });
        console.log("inside busboy")
        //atm never gets here, don't know why. seems to lost information what front end have sent
        busboy.on('file', async function (fieldname, file, filename, encoding, mimetype) {
            const attachmentData = {
                //agreementId: req.params.id, won't work atm since req.params doesn't have anything                
                agreementId: 1,
                savedOnDisk: false,
                filename: filename,
                type: mimetype
            };
            const attachmentId = await attachmentService.saveAttachment(attachmentData);
            const fileResponse = await fileService.savePdfFile(file, attachmentId);
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
        console.log("attachmentcontroller says 200, saved");
        res.status(200).json({ text: "attachment save successful" });
        return req.pipe(busboy);
    } catch (error) {
        console.log("attachment controller says 500, didn't save attachment :(")
        res.status(500).json({ text: "error occured", error: error });
    }
}
