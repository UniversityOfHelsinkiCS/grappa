import { callApi } from '../../util/apiConnection';

export const getEmailDrafts = () => {
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(prefix, method);
}

export const saveEmailDraft = (emailDraft) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix, method, emailDraft);
}

export const updateEmailDraft = (emailDraft) => {
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(prefix, method, emailDraft);
}

export const deleteEmailDraft = (emailDraft) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method, emailDraft);
}

const action = (suffix, response) => {
    return {
        type: "EMAILDRAFT_" + suffix,
        response,
    }
}

const callController = (prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi('/emaildrafts', method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}