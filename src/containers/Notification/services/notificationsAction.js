import { callController } from '../../../util/apiConnection'

export const getNotifications = () => callController('/notifications', 'NOTIFICATIONS_GET_ALL_')
