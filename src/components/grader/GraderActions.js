import { callApi } from '../../util/apiConnection';

export const ADD_GRADER_SAVE_ATTEMPT = 'ADD_GRADER_SAVE_ATTEMPT';
export const ADD_GRADER_SAVE_SUCCESS = 'ADD_GRADER_SAVE_SUCCESS';
export const ADD_GRADER_SAVE_FAILURE = 'ADD_GRADER_SAVE_FAILURE';

export const UPDATE_GRADER_SAVE_ATTEMPT = 'UPDATE_GRADER_SAVE_ATTEMPT';
export const UPDATE_GRADER_SAVE_SUCCESS = 'UPDATE_GRADER_SAVE_SUCCESS';
export const UPDATE_GRADER_SAVE_FAILURE = 'UPDATE_GRADER_SAVE_FAILURE';

export const GET_GRADERS_ATTEMPT = 'GET_GRADERS_ATTEMPT';
export const GET_GRADERS_SUCCESS = 'GET_GRADERS_SUCCESS';
export const GET_GRADERS_FAILURE = 'GET_GRADERS_FAILURE';

export const saveAddedAttempt = function () {
    return {
        type: ADD_GRADER_SAVE_ATTEMPT,
        text: 'Arvioijan/ohjaajan lisäys käynnistetty'
    };
}

export const saveAddedSuccess = function (data) {
    return {
        type: ADD_GRADER_SAVE_SUCCESS,
        text: 'Arvioija/ohjaaja lisätty onnistuneesti',
        data
    };
}

export const saveAddedFailure = function (error) {
    return {
        type: ADD_GRADER_SAVE_FAILURE,
        text: 'Arvioijan/ohjaajan lisäys epäonnistui',
        error
    };
}

export const saveUpdatedAttempt = function () {
    return {
        type: UPDATE_GRADER_SAVE_ATTEMPT,
        text: 'Arvioijan/ohjaajan päivitys käynnistetty'
    };
}

export const saveUpdatedSuccess = function (data) {
    return {
        type: UPDATE_GRADER_SAVE_SUCCESS,
        text: 'Arvioijan/ohjaajan päivitys onnistui',
        data
    };
}

export const saveUpdatedFailure = function (error) {
    return {
        type: UPDATE_GRADER_SAVE_FAILURE,
        text: 'Arvioijan/ohjaajan päivitys epäonnistui',
        error
    };
}


export const getGradersAttempt = function () {
    return {
        type: GET_GRADERS_ATTEMPT,
        text: 'Ohjaajien haku tietokannasta käynnistetty'
    };
}

export const getGradersSuccess = function (data) {
    return {
        type: GET_GRADERS_SUCCESS,
        text: 'Ohjaajien haku tietokannasta onnistui',
        data
    };
}

export const getGradersFailure = function (error) {
    return {
        type: GET_GRADERS_FAILURE,
        text: 'Ohjaajien haku tietokannasta epäonnistui',
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

export const saveAddedGrader = (grader) => {
    return (dispatch) => {
        dispatch(saveAddedAttempt());
        callApi('/supervisors', 'post', grader)
            .then(res =>  dispatch(saveAddedSuccess(res)))
            .catch(err => dispatch(saveAddedFailure(err.response)));
    }
}

export const saveUpdatedGrader = (grader) => {
    return (dispatch) => {
        dispatch(saveUpdatedAttempt());
        callApi('/supervisors', 'post', grader)
            .then(res =>  dispatch(saveUpdatedSuccess(res)))
            .catch(err => dispatch(saveUpdatedFailure(err.response)));
    }
}

