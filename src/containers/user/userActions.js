import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "USER_" + suffix,
        response,
    }
}

export const login = (shibbolethId) => {
    const prefix = "LOGIN_";
    //For now we use post to login
    const route = shibbolethId ? '/login/' + shibbolethId : '/login';
    return callController(prefix, shibbolethId, 'get', route);
}

export const getAllPersons = (data) => {
    const prefix = "GET_ALL_";
    //For now we use post to login
    return callController(prefix, data, 'get', '/persons');
}
/*
export const logout = () => {
    const prefix = "LOGOUT_";
    return callController(prefix);
}
*/
const callController = (prefix, data, method = 'get', route) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res.data)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}