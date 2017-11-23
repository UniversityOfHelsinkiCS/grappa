import { callApi } from '../../util/apiConnection';

export const getSupervisors = () => {
    const prefix = "GET_ALL_";
    const method = "get";
    const route = "/supervisors"
    return callController(prefix, method, '', route);
}

const action = (suffix, response) => {
    return {
        type: "SUPERVISOR_" + suffix,
        response,
    }
}

const callController = (prefix, method, data, route = '/supervisors') => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}
