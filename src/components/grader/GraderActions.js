import { callApi } from '../../util/apiConnection';

const action = (suffix, response) => {
    return {
        type: "GRADER_" + suffix,
        response,
    }
}

export const saveAddedGrader = (grader) => {
    const route = '/supervisors/save';
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, method, grader);
}

export const getSupervisors = () => {
    const route = '/supervisors'
    const prefix = "GET_ALL_";
    const method = "get";
    return callController(route, prefix, method);
}

export const deleteSupervisor = () => {
    const route = '/supervisors'
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, method);
}

const callController = (route, prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data) //TODO fix so that can use different paths
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}







/*export const saveAddedAttempt = function () {
    return {
        type: ADD_GRADER_SAVE_ATTEMPT,
        text: 'Trying to save a grader/supervisor'
    };
}
*/

/*
export const saveAddedSuccess = function (data) {
    return {
        type: ADD_GRADER_SAVE_SUCCESS,
        text: 'Grader/supervisor added',
        data
    };
}

export const saveAddedFailure = function (error) {
    return {
        type: ADD_GRADER_SAVE_FAILURE,
        text: 'Couldn\'t save a grader/supervisor',
        error
    };
}

export const saveUpdatedAttempt = function () {
    return {
        type: UPDATE_GRADER_SAVE_ATTEMPT,
        text: 'Trying to update a grader/supervisor'
    };
}

export const saveUpdatedSuccess = function (data) {
    return {
        type: UPDATE_GRADER_SAVE_SUCCESS,
        text: 'Grader/supervisor updated',
        data
    };
}

export const saveUpdatedFailure = function (error) {
    return {
        type: UPDATE_GRADER_SAVE_FAILURE,
        text: 'Couldn\'t update a grader/supervisor',
        error
    };
}


export const getGradersAttempt = function () {
    return {
        type: GET_GRADERS_ATTEMPT,
        text: 'Trying to get graders/supervisors'
    };
}

export const getGradersSuccess = function (data) {
    return {
        type: GET_GRADERS_SUCCESS,
        text: 'Managed to get graders/supervisors',
        data
    };
}

export const getGradersFailure = function (error) {
    return {
        type: GET_GRADERS_FAILURE,
        text: 'Couldn\'t get graders/supervisors',
        error
    };
}

export const getGraders = (grader) => {
    return (dispatch) => {
        dispatch(getGradersAttempt());
        callApi('/supervisors', 'get', grader)
            .then(res =>  dispatch(getGradersSuccess(res)))
            .catch(err => dispatch(getGradersFailure(err.response)));
    }
}

//old one
/*export const saveAddedGrader = (grader) => {
    return (dispatch) => {
        dispatch(saveAddedAttempt());
        callApi('/supervisors/save', 'post', grader)
            .then(res =>  dispatch(saveAddedSuccess(res)))
            .catch(err => dispatch(saveAddedFailure(err.response)));
    }
}
*/

/*
export const saveUpdatedGrader = (grader) => {
    return (dispatch) => {
        dispatch(saveUpdatedAttempt());
        callApi('/supervisors/update', 'post', grader)
            .then(res =>  dispatch(saveUpdatedSuccess(res)))
            .catch(err => dispatch(saveUpdatedFailure(err.response)));
    }
}

*/

