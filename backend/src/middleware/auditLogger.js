const notificationService = require('../services/NotificationService')
const logger = require('../util/logger')

const loggedMethods = ['POST', 'PUT', 'DELETE']

module.exports = function auditLogger(req, res, next) {
    console.log("Method: " + req.method)
    console.log("Time: " + new Date().toString())
    if (loggedMethods.includes(req.method)) {
        const type = `${req.method} ${req.originalUrl}`

        notificationService.createNotification(type, req)
            .catch(err => logger.error('Audit log save failed', { error: err }))
    }

    next()
}
