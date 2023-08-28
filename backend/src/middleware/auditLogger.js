const notificationService = require('../services/NotificationService')
const logger = require('../util/logger')

const loggedMethods = ['POST', 'PUT', 'DELETE']

module.exports = function auditLogger(req, res, next) {
    console.log("Req: " + req.method + " " + req.originalUrl + " at " + new Date().toString())
    if (req.headers && req.headers.uid) console.log("Uid: " + req.headers.uid)
    if (loggedMethods.includes(req.method)) {
        const type = `${req.method} ${req.originalUrl}`

        notificationService.createNotification(type, req)
            .catch(err => logger.error('Audit log save failed', { error: err }))
    }

    next()
}
