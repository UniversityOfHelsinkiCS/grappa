const router = require('express').Router()
const programmeController = require('../controllers/ProgrammeController')

/**
 * @api {get} programmes/ Get all programmes
 * @apiName Get all programmes
 * @apiGroup Programmes
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *  {"programmeId":1,"name":"Computer Science Masters programme","facultyId":1},
 *  {"programmeId":2,"name":"Data Science Masters programme","facultyId":1}
 * ]
 */
router.get('/', (req, res) => {
    programmeController.getAllProgrammes(req, res)
})

module.exports = router
