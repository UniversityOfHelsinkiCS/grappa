const router = require('express').Router()
const bodyParser = require('body-parser')
const councilmeetingController = require('../controllers/CouncilmeetingController')

const jsonParser = bodyParser.json()

/**
 * @api {get} councilmeetings/ Get councilmeetings
 * @apiName GetMeetings
 * @apiGroup Councilmeeting
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *  {
 *      "councilmeetingId": 1,
 *      "date": "2017-11-19T22:00:00.000Z",
 *      "instructorDeadline": "2017-11-11T22:00:00.000Z",
 *      "programmes": [],
 *      "studentDeadline": "2017-11-03T22:00:00.000Z"
 *  }
 * ]
 */
router.get('/', (req, res, next) => {
    councilmeetingController.getAllCouncilmeetings(req, res).catch(next)
})

/**
 * @api {post} councilmeetings/ Create councilmeeting
 * @apiName CreateMeeting
 * @apiGroup Councilmeeting
 *
 * @apiPermission admin, manager
 *
 * @apiParamExample {json} Request-Example
 *  {
 *      "date": "2017-11-19T22:00:00.000Z",
 *      "instructorDeadline": "2017-11-11T22:00:00.000Z",
 *      "programmes": [],
 *      "studentDeadline": "2017-11-03T22:00:00.000Z"
 *  }
 */
router.post('/', jsonParser, (req, res, next) => {
    councilmeetingController.saveCouncilmeeting(req, res).catch(next)
})

/**
 * @api {post} councilmeetings/ Update councilmeeting
 * @apiName UpdateMeeting
 * @apiGroup Councilmeeting
 *
 * @apiPermission admin, manager
 *
 * @apiParamExample {json} Request-Example
 *  {
 *      "councilmeetingId": 1,
 *      "date": "2017-11-19T22:00:00.000Z",
 *      "instructorDeadline": "2017-11-11T22:00:00.000Z",
 *      "programmes": [],
 *      "studentDeadline": "2017-11-03T22:00:00.000Z"
 *  }
 */
router.put('/:id', jsonParser, (req, res, next) => {
    councilmeetingController.updateCouncilmeeting(req, res).catch(next)
})

/**
 * @api {delete} councilmeetings/:id Delete councilmeeting
 * @apiName DeleteCouncilmeeting
 * @apiGroup Councilmeeting
 *
 * @apiPermission admin, manager
 *
 * @apiParam {Number} id meeting id
 */
router.delete('/:id', jsonParser, (req, res, next) => {
    councilmeetingController.deleteCouncilmeeting(req, res).catch(next)
})


module.exports = router
