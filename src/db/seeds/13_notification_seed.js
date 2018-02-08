const notifications = require('../../mockdata/MockNotifications')

exports.seed = knex =>
    // Deletes ALL existing entries
    knex('notification').del()
        .then(() =>
            // Inserts seed entries
            knex('notification').insert(notifications)
        );

