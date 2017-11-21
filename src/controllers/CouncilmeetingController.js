const councilmeetingService = require('../services/CouncilmeetingService');

export async function getAllCouncilmeetings(req, res) {
    const councilmeetings = await councilmeetingService.getAllCouncilmeetings();
    res.status(200).json(councilmeetings);
}

export async function saveCouncilmeeting(req, res) {
    const councilmeeting = req.body;
    if (councilmeeting) {
        const savedMeeting = await councilmeetingService.saveCouncilmeeting(councilmeeting);
        res.status(200).json(savedMeeting);
    }
}

export async function updateCouncilmeeting(req, res) {
    const councilmeetingId = req.params.id;
    const councilmeeting = req.body;
    if (councilmeetingId && councilmeeting) {
        const updatedMeeting = await councilmeetingService.updateCouncilmeeting(councilmeeting, councilmeetingId)
        res.status(200).json(updatedMeeting);
    }
}

export async function deleteCouncilmeeting(req, res) {
    const councilmeetingId = req.params.id;
    if (councilmeetingId) {
        const id = await councilmeetingService.deleteCouncilmeeting(councilmeetingId);
        res.status(200).json({ id });
    }
}