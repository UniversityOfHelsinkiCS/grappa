import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "THESIS_" + suffix,
        response,
    }
}

export const getTheses = () => {
    const route = '/theses';
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(route, prefix, method);
}

export const getThesis = (thesisId) => {
    const route = '/theses' + thesisId;
    const prefix = "GET_ONE_";
    const method = "get";
    return callController(route, prefix, method);
}

export const saveThesis = (thesis) => {
    const route = '/theses';
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, method, thesis);
}

export const updateThesis = (thesis) => {
    const route = '/theses';
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, method, thesis);
}

export const deleteThesis = (thesisId) => {
    const route = '/theses/' + thesisId;
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, method, thesisId);
}

const callController = (route, prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res.data)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}
