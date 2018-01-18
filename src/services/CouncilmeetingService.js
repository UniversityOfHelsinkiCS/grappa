const knex = require('../db/connection');
const Councilmeeting = require('../db/models/councilmeeting');

export const getAllCouncilmeetings = () => Councilmeeting.fetchAll();

export const saveCouncilmeeting = councilmeeting =>
    new Councilmeeting(councilmeeting).save().then(m => m.get('councilmeetingId'));

export const updateCouncilmeeting = (councilmeeting, councilmeetingId) => knex('councilmeeting')
    .returning('councilmeetingId')
    .where('councilmeetingId', '=', councilmeetingId)
    .update(councilmeeting)
    .then(councilmeetings => councilmeetings[0]);

export const deleteCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).destroy();

export const getCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).fetch();

