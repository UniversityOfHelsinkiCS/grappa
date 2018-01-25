const notifications = require('../../mockdata/MockNotifications')

exports.seed = (knex) => {
    // Deletes ALL existing entries
    return knex('notification').del()
        .then(() => {
            // Inserts seed entries
            return knex('notification').insert(notifications);
        });
};