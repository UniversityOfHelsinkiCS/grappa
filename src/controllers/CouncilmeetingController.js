const councilmeetingService = require('../services/CouncilmeetingService');
const notificationService = require('../services/NotificationService');

const mapProgrammesToIds = (councilmeeting) => {
    const copyMeeting = Object.assign({}, councilmeeting);
    copyMeeting.programmes = councilmeeting.programmes.reduce((acc, cur) => {
        return acc.concat(cur.programmeId);
    }, [])
    return copyMeeting
}

const serializeAndTrim = (councilmeetings) => {
    const serialized = councilmeetings.serialize({ omitPivot: true });
    if (serialized instanceof Array) {
        return serialized.map(meeting => mapProgrammesToIds(meeting))
    }
    return mapProgrammesToIds(serialized)
}

export async function getAllCouncilmeetings(req, res) {
    try {
        const councilmeetings = await councilmeetingService.getAllCouncilmeetings()
        const responseMeetings = serializeAndTrim(councilmeetings)
        res.status(200).json(responseMeetings).end()
    } catch (error) {
        res.status(500).end()
    }
}

export async function saveCouncilmeeting(req, res) {
    const councilmeeting = req.body;

    if (councilmeeting) {
        const programmeIds = councilmeeting.programmes;
        delete councilmeeting.programmes;
        try {
            const savedMeeting = await councilmeetingService.saveCouncilmeeting(councilmeeting, programmeIds);
            const responseMeeting = serializeAndTrim(savedMeeting)
            programmeIds.forEach((programmeId) => {
                notificationService.createNotification('COUNCILMEETING_SAVE_ONE_SUCCESS', req, programmeId);
            });
            res.status(200).json(responseMeeting);
        } catch (error) {
            res.status(500).end()
        }
    }
}

export async function updateCouncilmeeting(req, res) {
    const councilmeetingId = req.params.id;
    const councilmeeting = req.body;

    if (councilmeetingId && councilmeeting) {
        const programmeIds = councilmeeting.programmes;
        delete councilmeeting.programmes;
        await councilmeetingService.updateCouncilmeeting(councilmeeting, councilmeetingId);
        await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(councilmeetingId, programmeIds);
        const updatedMeeting = await councilmeetingService.getCouncilmeeting(councilmeetingId);

        programmeIds.forEach((programmeId) => {
            notificationService.createNotification('COUNCILMEETING_UPDATE_ONE_SUCCESS', req, programmeId);
        });
        res.status(200).json(updatedMeeting);
    }
}

export async function deleteCouncilmeeting(req, res) {
    const councilmeetingId = req.params.id;

    if (councilmeetingId) {
        await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(councilmeetingId, []);
        await councilmeetingService.deleteCouncilmeeting(councilmeetingId);
        notificationService.createNotification('COUNCILMEETING_DELETE_ONE_SUCCESS', req);
        res.status(200).json({ councilmeetingId });
    }
}
