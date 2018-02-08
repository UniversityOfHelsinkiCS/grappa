const attachments = require('../../mockdata/MockAttachments')

exports.seed = function (knex) {
    // Deletes ALL existing entries
    return knex('attachment').del()
        .then(() =>
            // Inserts seed entries
            knex('attachment').insert(attachments)
        );
};
