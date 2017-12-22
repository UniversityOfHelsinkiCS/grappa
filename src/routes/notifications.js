const router = require('express').Router();
const notificationController = require('../controllers/NotificationController');

router.get('/', notificationController.getNotifications);

module.exports = router;
