import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "THESIS_" + suffix,
        response,
    }
}

export const getTheses = (studyfield) => {
    const route = '/thesis';
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(route, prefix, method, studyfield);
}

export const saveThesis = () => {
    const route = '/thesis';
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, method);
}

export const updateThesis = (studyfield) => {
    const route = '/thesis';
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, method, studyfield);
}

export const deleteThesis = (thesisId) => {
    const route = '/thesis/' + thesisId;
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, method, thesisId);
}

const callController = (route, prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}
