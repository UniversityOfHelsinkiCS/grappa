import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "STUDYFIELD_" + suffix,
        response,
    }
}

export const getStudyfields = (studyfield) => {
    const route = '/studyfields';
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(route, prefix, method, studyfield);
}

export const saveStudyfield = () => {
    const route = '/studyfields';
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, method);
}

export const updateStudyfield = (studyfield) => {
    const route = '/studyfields';
    const prefix = "UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, method, studyfield);
}

export const deleteStudyfield = (studyfieldId) => {
    const route = '/studyfields/' + studyfieldId;
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, method, studyfieldId);
}

const callController = (route, prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}
