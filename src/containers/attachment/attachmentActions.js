import { callController } from '../../util/apiConnection';

export const createAttachment = (attachment) => {
    const route = '/attachments';
    const prefix = 'ATTACHMENT_CREATE_ONE_';
    const method = 'post';
    return callController(route, prefix);
}

export const deleteAttachment = (attachmentId) => {
    const route = '/attachments/' + attachmentId;
    const prefix = 'ATTACHMENT_DELETE_ONE_';
    const method = 'delete';
    return callController(route, prefix);
}