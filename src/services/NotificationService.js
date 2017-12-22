const knex = require('../db/connection');

const personService = require('./PersonService');

const notificationSchema = [
    'notificationId',
    'type',
    'userId',
    'timestamp'
];

export function getAllNotifications() {
    return knex.select(notificationSchema).from('notification');
}

export async function createNotification(type, req) {
    const person = await personService.getLoggedPerson(req);
    return saveNotification(type, person.personId);
}

export function saveNotification(type, user) {
    return knex('notification').insert({ type, userId: user });
}
