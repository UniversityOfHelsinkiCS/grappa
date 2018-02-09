const router = require('express').Router();
const inviteController = require('../controllers/InviteController');

/**
 * @api {get} invite/thesis/:token Accept thesis invite
 * @apiName AcceptThesisInvite
 * @apiGroup Invite
 *
 * @apiParam {String} token Invite token
 *
 * @apiDescription
 * Links saved thesis to current logged in user. Token specifies thesis in database.
 * Each token can be used only once.
 */
router.get('/thesis/:token', (req, res, next) => inviteController.thesisAuthorInvite(req, res).catch(next));

/**
 * @api {get} invite/role/:token Accept role invite
 * @apiName AcceptRoleInvite
 * @apiGroup Invite
 *
 * @apiParam {String} token Invite token
 *
 * @apiDescription
 * Links granted role to current logged in user. Token specifies role in database.
 * Each token can be used only once.
 */
router.get('/role/:token', (req, res, next) => inviteController.roleInvite(req, res).catch(next));

module.exports = router;
