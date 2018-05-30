const router = require('express').Router()
const bodyParser = require('body-parser')

const jsonParser = bodyParser.json()
const auth = require('../middleware/auth')
const roleController = require('../controllers/RoleController')

/**
 * @api {get} roles/available Get available roles
 * @apiName AvailableRoles
 * @apiGroup Roles
 *
 * @apiDescription
 * Lists all available roles which logged in user can grant.
 *
 * @apiSuccessExample {json} Success-Response
 * [
 *  {
 *      "roleId": 2,
 *      "name": "manager"
 *  }
 * ]
 */
router.get('/available', (req, res, next) => {
    roleController.getAvailableRoles(req, res).catch(next)
})

/**
 * @api {post} roles/ Save new role
 * @apiName SaveRole
 * @apiGroup Roles
 *
 * @apiPermission admin manager
 *
 * @apiParam {Number} roleId Role id
 * @apiParam {Number} personId Person id
 * @apiParam {Number} programmeId Programme id
 */
router.post('/', jsonParser, auth.checkManagerOrAdmin, (req, res, next) => {
    roleController.saveRole(req, res).catch(next)
})

/**
 * @api {put} roles/ Update statement
 * @apiName UpdateStatement
 * @apiGroup Roles
 *
 * @apiParam {String} statement Statement text
 * @apiParam {Boolean} approved Is person role approved
 */
router.put('/', jsonParser, auth.checkStaff, (req, res, next) => {
    roleController.updateStatement(req, res).catch(next)
})

/**
 * @api {delete} roles/:id Remove role
 * @apiName DeleteRole
 * @apiGroup Roles
 *
 * @apiPermission admin manager
 *
 * @apiParam {Number} id Role id
 */
router.delete('/:id', jsonParser, auth.checkManagerOrAdmin, (req, res, next) => {
    roleController.deleteRole(req, res).catch(next)
})

router.post('/grader_request', jsonParser, (req, res, next) => {
    roleController.sendGraderRequest(req, res).catch(next)
})

router.get('/requests', auth.checkManagerOrAdmin, (req, res, next) => {
    roleController.getUnhandledRoleRequests(req, res).catch(next)
})

router.post('/requests', auth.checkManagerOrAdmin, jsonParser, (req, res, next) => {
    roleController.handleRoleRequest(req, res).catch(next)
})

module.exports = router
