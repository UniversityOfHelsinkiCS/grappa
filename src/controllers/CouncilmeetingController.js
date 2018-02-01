const councilmeetingService = require('../services/CouncilmeetingService');
const notificationService = require('../services/NotificationService');

export async function getAllCouncilmeetings(req, res) {
    try {
        const councilmeetings = await councilmeetingService.getAllCouncilmeetings();

        const responseMeetings = councilmeetings.serialize({ omitPivot: true })
            .map((meeting) => { // Trim programmes to simply array of ids
                const copyMeeting = Object.assign({}, meeting);
                copyMeeting.programmes = meeting.programmes.reduce((acc, cur) => {
                    return acc.concat(cur.programmeId);
                }, [])
                return copyMeeting
            })
        res.status(200).json(responseMeetings);
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
            const savedMeetingId = await councilmeetingService.saveCouncilmeeting(councilmeeting);
            await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(savedMeetingId, programmeIds);
            const savedMeeting = await councilmeetingService.getCouncilmeeting(savedMeetingId);
            programmeIds.forEach((programmeId) => {
                notificationService.createNotification('COUNCILMEETING_SAVE_ONE_SUCCESS', req, programmeId);
            });
            res.status(200).json(savedMeeting);
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
