const knex = require('../db/connection');

const personService = require('./PersonService');

const notificationSchema = [
    'notificationId',
    'type',
    'userId',
    'timestamp',
    'studyfieldId'
];

export function getAllNotifications() {
    return knex.select(notificationSchema).from('notification');
}

export async function createNotification(type, req, studyfieldId) {
    const person = await personService.getLoggedPerson(req);
    const personId = person ? person.personId : null;

    return saveNotification(type, personId, studyfieldId);
}

export function saveNotification(type, user, studyfieldId) {
    return knex('notification').insert({ type, userId: user, studyfieldId });
}
