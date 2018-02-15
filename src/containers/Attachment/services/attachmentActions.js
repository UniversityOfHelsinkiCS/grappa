import { callController } from '../../../util/apiConnection'

export const createAttachment = (attachment) => {
    const route = '/attachments'
    const prefix = 'ATTACHMENT_SAVE_ONE_'
    const method = 'post'
    return callController(route, prefix, attachment, method)
}

export const deleteAttachment = (attachmentId) => {
    const route = `/attachments/${attachmentId}`
    const prefix = 'ATTACHMENT_DELETE_ONE_'
    const method = 'delete'
    return callController(route, prefix, attachmentId, method)
}

export const downloadAttachments = (attachmentIds) => {
    const idString = attachmentIds.reduce((accumulated, current) => (accumulated ? `${accumulated}&` : '') + current)
    const route = `/attachments/${idString}`
    const prefix = 'ATTACHMENT_DOWNLOAD_'
    return callController(route, prefix)
}
