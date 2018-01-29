const studyfieldService = require('../services/StudyfieldService');

export async function getAllStudyfields(req, res) {
    const studyfields = await studyfieldService.getStudyfields();
    res.status(200).json(studyfields);
}
