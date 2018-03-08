const attachments = require('../../mockdata/MockAttachments')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('attachment').del()
    // Inserts seed entries
    await knex('attachment').insert(attachments)
    return knex.raw('ALTER SEQUENCE "attachment_attachmentId_seq" RESTART WITH 50')
}
