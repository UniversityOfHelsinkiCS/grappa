const router = require('express').Router()

const statisticsController = require('../controllers/statistics')

/**
 * @api {get} statistics/ Get statistics
 * @apiName GetStatistics
 * @apiGroup Statistics
 *
 * @apiDescription
 * Returns statistics from theses saved to system.
 *
 * Returns nested json object with structure
 * year -> programme -> studyfield -> grade counts
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *      "2017": {
 *         "9": {
 *           "10": {
 *               "newGrades": {
 *                   "1": 0,
 *                   "2": 0,
 *                   "3": 0,
 *                   "4": 0,
 *                   "5": 0
 *               },
 *               "oldGrades": {
 *                   "Approbatur": 0,
 *                   "Lubenter Approbatur": 0,
 *                   "Non Sine Laude Approbatur": 0,
 *                   "Cum Laude Approbatur": 0,
 *                   "Magna Cum Laude Approbatur": 0,
 *                   "Eximia Cum Laude Approbatur": 1,
 *                   "Laudatur": 0
 *               }
 *           }
 *       }
 * }
 */
router.get('/', (req, res, next) => statisticsController.getStatistics(req, res).catch(next))

module.exports = router
