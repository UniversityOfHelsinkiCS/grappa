const knex = require('../db/connection').getKnex();
const Councilmeeting = require('../db/models/councilmeeting');
const moment = require('moment');
const Bookshelf = require('../db/bookshelf');

// TODO: Use bookshelf to combine programmes into councilmeeting

export const getAllCouncilmeetings = async () => {
    return Councilmeeting.fetchAll({ withRelated: ['programmes'] });
}

export const saveCouncilmeeting = async (councilmeeting, programmeIds) => {
    validateMeetingDates(councilmeeting);
    const savedMeeting = await Bookshelf.transaction(async (t) => {
        const meeting = await Councilmeeting
            .forge(toCouncilmeetingObject(councilmeeting))
            .save(null, {
                transacting: t
            })
        await meeting
            .programmes()
            .attach(programmeIds, {
                transacting: t
            });
        return meeting;
    })

    return savedMeeting.load(['programmes'])
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
