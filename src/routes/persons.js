const router = require('express').Router()
const bodyParser = require('body-parser')
const personController = require('../controllers/PersonController')

const jsonParser = bodyParser.json()

/**
 * @api {get} persons/ Get persons
 * @apiName GetPersons
 * @apiGroup Persons
 *
 * @apiDescription Returns all persons related to logged in user.
 *
 * @apiSuccessExample {json} Success-Response
 * {
 *  persons: [
 *      {
 *          "personId": 1,
 *          "shibbolethId": "personShibbolethId",
 *          "email": "olli@example.com",
 *          "firstname": "Olli",
 *          "lastname": "Opiskelija",
 *          "isRetired": false,
 *          "studentNumber": "0123456789",
 *          "phone": "050 1234567"
 *      }
 *  ],
 *  roles: [
 *    {
 *      "personRoleId": 1,
 *      "personId": 1,
 *      "programmeId": 1,
 *      "name": "grader",
 *      "agreementId": 1,
 *      "statement": null,
 *      "approved": null,
 *      "approverId": null,
 *      "approvalDate": null
 *    }
 *  ]
 * }
 */
router.get('/', (req, res, next) => personController.getPersons(req, res).catch(next))

/**
 * @api {post} persons/invite Invite person to role
 * @apiName InvitePerson
 * @apiGroup Persons
 *
 * @apiPermission admin manager
 *
 * @apiDescription Sends invite to role email.
 *
 * @apiParam {Number} programme Programme id
 * @apiParam {Number} role Role id of given role
 * @apiParam {String} email Email where invitation is sent
 */
router.post('/invite', jsonParser, (req, res, next) => personController.invitePerson(req, res).catch(next))

/**
 * @api {put} persons/email switch between user emails
 * @apiName SecondaryMail
 * @apiGroup Persons
 *
 * @apiParam {bool} useSecondaryEmail
 */
router.put('/email', jsonParser, (req, res, next) => personController.useSecondaryEmail(req, res).catch(next))

router.post('/add_outsider', jsonParser, (req, res, next) => personController.addOutsidePerson(req, res).catch(next))

router.get('/managers', jsonParser, (req, res, next) => personController.getManagers(req, res).catch(next))

router.get('/graders', jsonParser, (req, res, next) => personController.getProgrammeGraders(req, res).catch(next))

router.post('/request_grader', jsonParser, (req, res, next) => personController.requestGrader(req, res).catch(next))

module.exports = router
