import { callApi } from '../../util/apiConnection';

export const getCouncilmeetings = () => {
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(prefix, method);
}

export const saveCouncilmeeting = (councilmeeting) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix, method, councilmeeting);
}

export const updateCouncilmeeting = (councilmeeting) => {
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(prefix, method, councilmeeting);
}

export const deleteCouncilmeeting = (councilmeetingId) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method, councilmeetingId);
}

const action = (suffix, response) => {
    return {
        type: "COUNCILMEETING_" + suffix,
        response,
    }
}

const callController = (prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi('/councilmeetings', method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}