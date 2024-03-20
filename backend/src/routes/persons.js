const router = require('express').Router()
const bodyParser = require('body-parser')
const auth = require('../middleware/auth')
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
router.get('/', auth.checkManagerOrAdmin, (req, res, next) => personController.getPersons(req, res).catch(next))

router.get('/search', auth.checkAdmin, (req, res, next) => personController.findPersons(req, res).catch(next))

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
router.post('/invite', jsonParser, auth.checkManagerOrAdmin, (req, res, next) =>
    personController.invitePerson(req, res).catch(next))

/**
 * @api {put} persons/email switch between user emails
 * @apiName SecondaryMail
 * @apiGroup Persons
 *
 * @apiParam {bool} useSecondaryEmail
 */
router.put('/email', jsonParser, (req, res, next) => personController.useSecondaryEmail(req, res).catch(next))

/**
 * @api {get} persons/managers get all managers of Grappa
 */
router.get('/managers', jsonParser, (req, res, next) => personController.getManagers(req, res).catch(next))

/**
 * @api {get} persons/graders get for the specified programme
 * @apiQuery {Number} programmeId
 */
router.get('/graders', jsonParser, (req, res, next) => personController.getProgrammeGraders(req, res).catch(next))

/**
 * @api {post} persons/request_grader request grader role for a program
 * Requester needs to have right to submit theses.
 * @apiParam {Object} person {email: String, firstname: String, lastname: String}
 * @apiParem {Object} roleRequest {role: String, programmeId: String}
 */
router.post('/request_grader', jsonParser, auth.checkCanSubmitThesis, (req, res, next) =>
    personController.requestGrader(req, res).catch(next))

module.exports = router
