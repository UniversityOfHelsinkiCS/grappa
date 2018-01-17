const knex = require('../db/connection');

export async function getAllCouncilmeetings() {
    return knex.select().from('councilmeeting').then(councilmeeting => councilmeeting);
}

export async function saveCouncilmeeting(councilmeeting) {
    return knex('councilmeeting')
        .returning('councilmeetingId')
        .insert(councilmeeting)
        .then(councilmeetings => councilmeetings[0]);
}

export async function updateCouncilmeeting(councilmeeting, councilmeetingId) {
    return knex('councilmeeting')
        .returning('councilmeetingId')
        .where('councilmeetingId', '=', councilmeetingId)
        .update(councilmeeting)
        .then(councilmeetings => councilmeetings[0]);
}

export async function deleteCouncilmeeting(councilmeetingId) {
    return knex('councilmeeting')
        .where('councilmeetingId', '=', councilmeetingId)
        .del()
        .then(() => councilmeetingId);
}

export async function getCouncilmeeting(councilmeetingId) {
    return knex.select('*').from('councilmeeting')
        .where('councilmeetingId', '=', councilmeetingId)
        .then(councilmeetings => councilmeetings[0]);
}
