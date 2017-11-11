require('babel-polyfill');
const knex = require('../../connection');

export async function saveAttachment(attachmentData) {
    return knex('attachment')
    .returning('attachmentId')
    .insert(attachmentData)
    .then(attachmentId => attachmentId[0])
    .catch(err => err);
}

export async function updateAttachment(attachmentData) {
    return await knex('attachment')
    .returning('attachmentId')
    .where('attachmentId', '=', attachmentData.attachmentId)
    .update(attachmentData)
    .then(attachmentId => attachmentId[0])
    .catch(err => err);
}