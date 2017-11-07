import { callApi } from '../../util/apiConnection';

export const getCouncilmeetings = () => {
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(prefix, method);
}

export const saveCouncilmeeting = (councilmeeting) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix, method);
}

export const updateCouncilmeeting = (councilmeeting) => {
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(prefix, method);
}

export const deleteCouncilmeeting = (councilmeeting) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method);
}

const action = (suffix, response) => {
    return {
        type: "COUNCILMEETING_" + suffix,
        response,
    }
}

const callController = (prefix, method) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi('/councilmeetings', method)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}