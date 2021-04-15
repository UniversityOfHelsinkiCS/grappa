const router = require('express').Router()
const notificationController = require('../controllers/NotificationController')

/**
 * @api {get} notifications/ Get notifications
 * @apiName GetNotifications
 * @apiGroup Notifications
 *
 * @apiDescription
 * Returns admin notificatios. Notifications are created when
 * data is modified in system.
 *
 * @apiPermission admin manager
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *  {
 *      "notificationId":120,
 *      "type":"THESIS_SAVE_ONE_SUCCESS",
 *      "userId":2,
 *      "timestamp":"2018-02-09T10:11:35.776Z",
 *      "programmeId":1
 *   }
 * ]
 */
router.get('/', notificationController.getNotifications)

module.exports = router
