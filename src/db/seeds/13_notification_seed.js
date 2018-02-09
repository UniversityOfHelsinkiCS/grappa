const notifications = require('../../mockdata/MockNotifications')

exports.seed = async (knex) => {
    // Deletes ALL existing entries
    await knex('notification').del()
    // Inserts seed entries
    return knex('notification').insert(notifications)
}
