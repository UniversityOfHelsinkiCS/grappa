const notifications = require('../../mockdata/MockNotifications')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('notification').del()
    // Inserts seed entries
    await knex('notification').insert(notifications)
    return knex.raw('ALTER SEQUENCE "notification_notificationId_seq" RESTART WITH 50')
}
