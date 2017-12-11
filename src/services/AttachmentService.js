const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Attachment = require('../db/models/attachment');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage }).array('attachment')

const attachmentSchema = [
    "attachmentId",
    "agreementId",
    "filename",
    "type",
    "savedOnDisk"
]

export async function saveAttachments(req, res, agreementId) {
    console.log("Saving to disk");
    let uploaded = new Promise((resolve, reject) => {
        upload(req, res, error => {
            if (error) {
                reject(error);
            }
            console.log('Attachments saved to disk');
            resolve(req);
        })
    })
    const request = await uploaded
    
    return Promise.all(request.files.map(async file => {
        const attachment = {
            agreementId: agreementId,
            savedOnDisk: true,
            filename: file.filename,
            type: file.mimetype
        };
        await Attachment.forge(attachment).save()
    }))
}

export async function getAttachmentsForAgreement(agreementId) {
    return knex.select(attachmentSchema)
        .from('attachment')
        .where('agreementId', agreementId);
}

export async function updateAttachment(attachment) {
    return await knex('attachment')
        .returning('attachmentId')
        .where('attachmentId', '=', attachment.attachmentId)
        .update(attachment)
        .then(attachmentId => attachmentId[0])
        .catch(error => {
            throw error
        });
}