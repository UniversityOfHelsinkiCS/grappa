const councilmeetingService = require('../services/CouncilmeetingService');
const notificationService = require('../services/NotificationService');

export async function getAllCouncilmeetings(req, res) {
    try {
        const councilmeetings = await councilmeetingService.getAllCouncilmeetings();
        res.status(200).json(councilmeetings);
    } catch (error) {
        res.status(500).end();
    }
}

export async function saveCouncilmeeting(req, res) {
    try {
        const councilmeeting = req.body;
        if (councilmeeting) {
            const programmeIds = councilmeeting.programmes;
            delete councilmeeting.programmes;

            const savedMeetingId = await councilmeetingService.saveCouncilmeeting(councilmeeting);
            await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(savedMeetingId, programmeIds)
            const savedMeeting = await councilmeetingService.getCouncilmeeting(savedMeetingId);
            programmeIds.forEach(programmeId => {
                notificationService.createNotification('COUNCILMEETING_SAVE_ONE_SUCCESS', req, programmeId);
            })
            res.status(200).json(savedMeeting);
        }
    } catch (error) {
        res.status(500).end();
    }
}

export async function updateCouncilmeeting(req, res) {
    try {
        const councilmeetingId = req.params.id;
        const councilmeeting = req.body;
        if (councilmeetingId && councilmeeting) {
            const programmeIds = councilmeeting.programmes;
            delete councilmeeting.programmes;
            await councilmeetingService.updateCouncilmeeting(councilmeeting, councilmeetingId);
            await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(councilmeetingId, programmeIds)
            const updatedMeeting = await councilmeetingService.getCouncilmeeting(councilmeetingId);

            programmeIds.forEach(programmeId => {
                notificationService.createNotification('COUNCILMEETING_UPDATE_ONE_SUCCESS', req, programmeId);
            })
            res.status(200).json(updatedMeeting);
        }
    } catch (error) {
        res.status(500).end();
    }
}

export async function deleteCouncilmeeting(req, res) {
    try {
        const councilmeetingId = req.params.id;
        if (councilmeetingId) {
            await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(councilmeetingId, []);
            await councilmeetingService.deleteCouncilmeeting(councilmeetingId);
            notificationService.createNotification('COUNCILMEETING_DELETE_ONE_SUCCESS', req);
            res.status(200).json({ councilmeetingId });
        }
    } catch (error) {
        res.status(500).end();
    }
}
