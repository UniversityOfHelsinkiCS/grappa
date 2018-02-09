const attachments = require('../../mockdata/MockAttachments')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('attachment').del()
    // Inserts seed entries
    return knex('attachment').insert(attachments)
};
