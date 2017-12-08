const knex = require('../db/connection');

const attachmentSchema = [
    "attachmentId",
    "agreementId",
    "filename",
    "type",
    "savedOnDisk"
]

export async function saveAttachment(attachmentData) {
    return knex('attachment')
        .returning('attachmentId')
        .insert(attachmentData)
        .then(attachmentId => attachmentId[0])
        .catch(error => {
            throw error
        });
}

export async function updateAttachment(attachmentData) {
    return await knex('attachment')
        .returning('attachmentId')
        .where('attachmentId', '=', attachmentData.attachmentId)
        .update(attachmentData)
        .then(attachmentId => attachmentId[0])
        .catch(error => {
            throw error
        });
}