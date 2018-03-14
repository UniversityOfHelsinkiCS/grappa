const studyfieldService = require('../services/StudyfieldService')

const serializeAndTrim = (studyfield) => {
    const serialized = studyfield.serialize({ omitPivot: true })
    return serialized
}

export async function getAllStudyfields(req, res) {
    const studyfields = await studyfieldService.getStudyfields()
    res.status(200).json(serializeAndTrim(studyfields))
}
