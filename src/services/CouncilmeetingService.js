const knex = require('../db/connection').getKnex();
const Councilmeeting = require('../db/models/councilmeeting');
const moment = require('moment');

// TODO: Use bookshelf to combine programmes into councilmeeting

export const getAllCouncilmeetings = async () => {
    return Councilmeeting.fetchAll({ withRelated: ['programmes'] });
};

export const saveCouncilmeeting = (councilmeeting) => {
    validateMeetingDates(councilmeeting);
    return new Councilmeeting(toCouncilmeetingObject(councilmeeting)).save().then(m => m.get('councilmeetingId'));
};

export const unlinkAndLinkCouncilmeetingToProgrammes = async (councilmeetingId, programmeIds) => {
    await knex('meetingProgramme').where('councilmeetingId', councilmeetingId).del();
    return Promise.all(programmeIds.map(async (programmeId) => {
        const meetingProgramme = {
            councilmeetingId,
            programmeId
        }
        return knex('meetingProgramme').insert(meetingProgramme);
    }))
};

export const updateCouncilmeeting = (councilmeeting, councilmeetingId) => {
    validateMeetingDates(councilmeeting);
    return new Councilmeeting({ councilmeetingId }).save(toCouncilmeetingObject(councilmeeting));
};

const toCouncilmeetingObject = councilmeeting => ({
    date: moment(councilmeeting.date).toDate(),
    instructorDeadline: moment(councilmeeting.instructorDeadline).toDate(),
    studentDeadline: moment(councilmeeting.studentDeadline).toDate(),
});

export const deleteCouncilmeeting = councilmeetingId =>
    Councilmeeting.where('councilmeetingId', councilmeetingId).destroy();

export const getCouncilmeeting = async (councilmeetingId) => {
    const model = await Councilmeeting
        .where('councilmeetingId', councilmeetingId)
        .fetch({ withRelated: ['programmes'] });

    const meeting = model.attributes;
    meeting.programmes = model.related('programmes').map(p => p.attributes.programmeId);
    return meeting;
};

function validateMeetingDates(meeting) {
    const meetingDate = moment(meeting.date);
    const instructorDeadline = moment(meeting.instructorDeadline);
    const studentDeadline = moment(meeting.studentDeadline);

    if (meetingDate.isBefore(instructorDeadline) || meetingDate.isBefore(studentDeadline))
        throw new Error('Invalid meeting dates');
}
