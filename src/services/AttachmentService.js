const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Attachment = require('../db/models/attachment');
const pdfManipulator = require('../util/pdfManipulator');
const multer = require('multer');
const pathToFolder = './uploads/';

const storage = () => {
    if (process.env.NODE_ENV === 'test') {
        return multer.memoryStorage();
    }
    return multer.diskStorage({
        destination: pathToFolder,
        filename: (req, file, cb) => {
            cb(null, Date.now() + '-' + file.originalname)
        }
    })
}
const upload = multer({ storage: storage() }).array('attachment')

const attachmentSchema = [
    'attachmentId',
    'agreementId',
    'filename',
    'type',
    'savedOnDisk'
]

export async function saveAttachments(req, res, agreementId) {
    console.log('Saving to disk');
    //TODO: Transaction

    try {
        const uploaded = new Promise((resolve, reject) => {
            upload(req, res, error => {
                if (error) {
                    reject(error);
                }
                console.log('Attachments saved to disk');
                resolve(req);
            })
        })
        const request = await uploaded
        // agreementId is not null when saving a thesis, 
        // and in that case it's not in request.body.json
        let id = agreementId;
        if (!id) {
            id = JSON.parse(request.body.json).agreementId;
        }
        const attachments = await Promise.all(request.files.map(async file => {
            const attachment = {
                agreementId: id,
                savedOnDisk: true,
                filename: file.filename,
                type: file.mimetype
            };
            const attachmentIds = await knex('attachment')
                .returning('attachmentId')
                .insert(attachment)
            const attachmentId = attachmentIds[0]
            return knex.select(attachmentSchema).from('attachment').where('attachmentId', attachmentId).first()
        }))
        return { attachments: attachments, json: JSON.parse(request.body.json) }
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function getAllAttachments() {
    return knex.select(attachmentSchema).from('attachment');
}

export async function getAttachments(attachmentIds) {
    return knex.select(attachmentSchema).from('attachment')
        .whereIn('attachmentId', attachmentIds)
}

export async function getAttachmentsForAgreements(agreements) {
    const ids = agreements.map(agreement => agreement.agreementId);
    return knex.select(attachmentSchema).from('attachment')
        .whereIn('agreementId', ids);
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

export async function mergeAttachments(attachments) {
    const files = attachments.map(attachment => attachment.filename)
    try {
        return pdfManipulator.joinPdfs(pathToFolder, files);
    } catch (error) {
        throw error;
    }
}