const router = require('express').Router();
const studyfieldController = require('../controllers/StudyfieldController');

/**
 * @api {get} studyfields/ Get all studyfields
 * @apiName GetStudyfields
 * @apiGroup Studyfields
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *  { name: "Software systems", programmeId: 1, studyfieldId: 1 },
 *  { name: "Algorithms and machine learning", programmeId: 2, studyfieldId: 1 }
 * ]
 */
router.get('/', (req, res) => {
    studyfieldController.getAllStudyfields(req, res);
});

module.exports = router;
