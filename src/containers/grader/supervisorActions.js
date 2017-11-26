import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "SUPERVISOR_" + suffix,
        response,
    }
}

export const saveAddedSupervisor = (supervisor) => {
    const route = '/supervisors/save';
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, method, supervisor);
}

export const getSupervisors = () => {
    const route = '/supervisors/agreementPersons';
    const prefix = "GET_ALL_";
    const method = "get";
    const ret = callController(route, prefix, method)
    console.log(ret)
    return ret;
}

export const deleteSupervisor = (data) => {
    const route = '/supervisors';
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, method);
}

export const reviewSupervisor = (supervisor) => {
    const route = '/supervisors/review';
    const prefix = "REVIEW_ONE_";
    const method = "put";
    return callController(route, prefix, method, supervisor);
}

export const updateSupervisor = (supervisor) => {
    const route = '/supervisors/update';
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, method, supervisor);
}

const callController = (route, prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => {
            dispatch(action(prefix + "SUCCESS", res))})
        .catch(err => {
            dispatch(action(prefix + "FAILURE", err.response))});
}
