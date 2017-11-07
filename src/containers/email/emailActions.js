import { callApi } from '../../util/apiConnection';

export const getEmailDrafts = () => {
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(prefix, method);
}

export const saveEmailDraft = (councilmeeting) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix, method);
}

export const updateEmailDraft = (councilmeeting) => {
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(prefix, method);
}

export const deleteEmailDraft = (councilmeeting) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method);
}

const action = (suffix, response) => {
    return {
        type: "EMAILDRAFT_" + suffix,
        response,
    }
}

const callController = (prefix, method) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi('/emaildrafts', method)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}