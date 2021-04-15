import { checkUserIsAdminOrManager } from '../services/PermissionService'

const notificationService = require('../services/NotificationService')

export const getNotifications = async (req, res) => {
    try {
        await checkUserIsAdminOrManager(req)
        const notifications = await notificationService.getAllNotifications()
        res.status(200).json(notifications).end()
    } catch (err) {
        res.status(500).json(err).end()
    }
}
