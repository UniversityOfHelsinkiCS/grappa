const router = require('express').Router();
const inviteController = require('../controllers/InviteController');

router.get('/thesis/:token', inviteController.thesisAuthorInvite);

module.exports = router;
