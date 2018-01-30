const notificationService = require('../services/NotificationService');
const logger = require('../util/logger');

const loggedMethods = ['POST', 'PUT', 'DELETE'];

module.exports = function auditLogger(req, res, next) {
    if (loggedMethods.includes(req.method)) {
        const type = `${req.method} ${req.originalUrl}`;

        notificationService.createNotification(type, req)
            .catch(err => logger.error('Audit log save failed', { error: err }));
    }

    next();
};
