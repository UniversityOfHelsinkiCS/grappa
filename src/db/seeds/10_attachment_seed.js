const attachments = require('../../mockdata/MockAttachments')

exports.seed = function (knex, Promise) {
    // Deletes ALL existing entries
    return knex('attachment').del()
        .then(function () {
            // Inserts seed entries
            return knex('attachment').insert(attachments);
        });
};