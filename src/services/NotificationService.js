const knex = require('../db/connection');

const notificationSchema = [
    'notificationId',
    'type',
    'user',
    'timestamp'
];

export function getAllNotifications() {
    return knex.select(notificationSchema).from('notification');
}

export function saveNotification(type, user) {
    return knex('notification').insert({ type, userId: user });
}
