const router = require('express').Router();
const inviteController = require('../controllers/InviteController');

router.get('/thesis/:token', (req, res, next) => inviteController.thesisAuthorInvite(req, res).catch(next));
router.get('/role/:token', (req, res, next) => inviteController.roleInvite(req, res).catch(next));

module.exports = router;
