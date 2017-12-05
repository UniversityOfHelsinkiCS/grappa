require('babel-polyfill');
const knex = require('../db/connection');

export async function saveAttachment(attachmentData) {
    console.log("service")
    return knex('attachment')
    .returning('attachmentId')
    .insert(attachmentData)
    .then(attachmentId => attachmentId[0])
    .catch(error => {
        throw error});
}

export async function updateAttachment(attachmentData) {
    return await knex('attachment')
    .returning('attachmentId')
    .where('attachmentId', '=', attachmentData.attachmentId)
    .update(attachmentData)
    .then(attachmentId => attachmentId[0])
    .catch(error => {
        throw error});
}