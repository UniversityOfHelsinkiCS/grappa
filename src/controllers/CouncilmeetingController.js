const councilmeetingService = require('../services/CouncilmeetingService');
const notificationService = require('../services/NotificationService');

export async function getAllCouncilmeetings(req, res) {
    const councilmeetings = await councilmeetingService.getAllCouncilmeetings();
    res.status(200).json(councilmeetings);
}

export async function saveCouncilmeeting(req, res) {
    const councilmeeting = req.body;
    if (councilmeeting) {
        const { programmeIds } = councilmeeting;
        delete councilmeeting.programmeIds;

        const savedMeetingId = await councilmeetingService.saveCouncilmeeting(councilmeeting);
        const linkedIds = await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(savedMeetingId, programmeIds)
        const savedMeeting = await councilmeetingService.getCouncilmeeting(savedMeetingId);
        linkedIds.forEach(programmeId => {
            notificationService.createNotification('COUNCILMEETING_SAVE_ONE_SUCCESS', req, programmeId);
        })
        res.status(200).json(savedMeeting);
    }
}

export async function updateCouncilmeeting(req, res) {
    const councilmeetingId = req.params.id;
    const councilmeeting = req.body;
    if (councilmeetingId && councilmeeting) {
        const { programmeIds } = councilmeeting;
        delete councilmeeting.programmeIds;
        await councilmeetingService.updateCouncilmeeting(councilmeeting, councilmeetingId);
        const linkedIds = await councilmeetingService.unlinkAndLinkCouncilmeetingToProgrammes(councilmeetingId, programmeIds)
        const updatedMeeting = await councilmeetingService.getCouncilmeeting(councilmeetingId);
        linkedIds.forEach(programmeId => {
            notificationService.createNotification('COUNCILMEETING_UPDATE_ONE_SUCCESS', req, programmeId);
        })
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
