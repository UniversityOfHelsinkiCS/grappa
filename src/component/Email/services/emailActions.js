import { callController } from '../../../util/apiConnection';

export const getEmailDrafts = () => {
    const prefix = 'EMAILDRAFT_GET_ALL_';
    const route = '/emailDrafts';
    return callController(route, prefix);
}

export const saveEmailDraft = (emailDraft) => {
    const prefix = 'EMAILDRAFT_SAVE_ONE_';
    const route = '/emailDrafts';
    return callController(route, prefix, emailDraft, 'post');
}

export const updateEmailDraft = (emailDraft) => {
    const prefix = 'EMAILDRAFT_UPDATE_ONE_';
    const route = `/emailDrafts/${emailDraft.emailDraftId}`;
    return callController(route, prefix, emailDraft, 'post');
}

export const deleteEmailDraft = (emailDraft) => {
    const prefix = 'EMAILDRAFT_DELETE_ONE_';
    const route = `/emaildrafts/${emailDraft.emailDraftId}`;
    return callController(route, prefix, {}, 'delete');
}
