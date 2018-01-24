const knex = require('../db/connection');
const Councilmeeting = require('../db/models/councilmeeting');
const moment = require('moment');

export const getAllCouncilmeetings = () => Councilmeeting.fetchAll();

export const saveCouncilmeeting = (councilmeeting) => {
    validateMeetingDates(councilmeeting);
    return new Councilmeeting(toCouncilmeetingObject(councilmeeting)).save().then(m => m.get('councilmeetingId'));
};

export const updateCouncilmeeting = (councilmeeting, councilmeetingId) => {
    validateMeetingDates(councilmeeting);
    return knex('councilmeeting')
        .returning('councilmeetingId')
        .where('councilmeetingId', councilmeetingId)
        .update(toCouncilmeetingObject(councilmeeting))
        .then(councilmeetings => councilmeetings[0]);
};

const toCouncilmeetingObject = (councilmeeting) => ({
    date: moment(councilmeeting.date).toDate(),
    instructorDeadline: moment(councilmeeting.instructorDeadline).toDate(),
    studentDeadline: moment(councilmeeting.studentDeadline).toDate(),
    programmeId: councilmeeting.programmeId
});

export const deleteCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).destroy();

export const getCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).fetch();

function validateMeetingDates(meeting) {
    const meetingDate = moment(meeting.date);
    const instructorDeadline = moment(meeting.instructorDeadline);
    const studentDeadline = moment(meeting.studentDeadline);

    if (meetingDate.isBefore(instructorDeadline) || meetingDate.isBefore(studentDeadline))
        throw new Error('Invalid meeting dates');
}
