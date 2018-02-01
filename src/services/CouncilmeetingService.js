const knex = require('../db/connection').getKnex();
const Councilmeeting = require('../db/models/councilmeeting');
const moment = require('moment');

// TODO: Use bookshelf to combine programmes into councilmeeting

export const getAllCouncilmeetings = async () => {
    const meetings = await Councilmeeting.fetchAll();
    return Promise.all(meetings.models.map(async (model) => {
        const meeting = model.attributes;
        const programmes = await getProgrammesForMeeting(meeting.councilmeetingId)
        meeting.programmes = programmes.reduce((acc, cur) => {
            acc.push(cur.programmeId)
            return acc
        }, [])
        return meeting;
    }))
}

export const saveCouncilmeeting = (councilmeeting) => {
    validateMeetingDates(councilmeeting);
    return new Councilmeeting(toCouncilmeetingObject(councilmeeting)).save().then(m => m.get('councilmeetingId'));
};

const getProgrammesForMeeting = (councilmeetingId) => {
    return knex('meetingProgramme').select().where('councilmeetingId', councilmeetingId)
}

export const unlinkAndLinkCouncilmeetingToProgrammes = async (councilmeetingId, programmeIds) => {
    await knex('meetingProgramme').where('councilmeetingId', councilmeetingId).del()
    return Promise.all(programmeIds.map(async (programmeId) => {
        const meetingProgramme = {
            councilmeetingId,
            programmeId
        }
        return knex('meetingProgramme').insert(meetingProgramme);
    }))
}

export const updateCouncilmeeting = (councilmeeting, councilmeetingId) => {
    validateMeetingDates(councilmeeting);
    return knex('councilmeeting')
        .returning('councilmeetingId')
        .where('councilmeetingId', councilmeetingId)
        .update(toCouncilmeetingObject(councilmeeting))
        .then(councilmeetings => councilmeetings[0]);
};

const toCouncilmeetingObject = councilmeeting => ({
    date: moment(councilmeeting.date).toDate(),
    instructorDeadline: moment(councilmeeting.instructorDeadline).toDate(),
    studentDeadline: moment(councilmeeting.studentDeadline).toDate(),
});

export const deleteCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).destroy();

export const getCouncilmeeting = async (councilmeetingId) => {
    const model = await Councilmeeting.where('councilmeetingId', councilmeetingId).fetch();
    const programmes = await getProgrammesForMeeting(councilmeetingId)
    const meeting = model.attributes;
    meeting.programmes = programmes.reduce((acc, cur) => {
        acc.push(cur.programmeId)
        return acc
    }, [])
    return meeting;
}

function validateMeetingDates(meeting) {
    const meetingDate = moment(meeting.date);
    const instructorDeadline = moment(meeting.instructorDeadline);
    const studentDeadline = moment(meeting.studentDeadline);

    if (meetingDate.isBefore(instructorDeadline) || meetingDate.isBefore(studentDeadline))
        throw new Error('Invalid meeting dates');
}
