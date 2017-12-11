const knex = require('../db/connection');
const bookshelf = require('../db/bookshelf')
const Attachment = require('../db/models/attachment');

const attachmentSchema = [
    "attachmentId",
    "agreementId",
    "filename",
    "type",
    "savedOnDisk"
]

export async function saveAttachment(attachment) {
    const missing = attachmentSchema.find(key => !(key in attachment))
    if (!missing) {
        return Attachment.forge(attachment).save().then(model => {
            return model.fetch().select(attachmentSchema);
        }).catch(error => {
            throw error;
        })
    }
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