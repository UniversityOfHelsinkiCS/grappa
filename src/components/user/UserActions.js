import { callApi } from '../../util/apiConnection';

export const CHANGE_ROLE_ATTEMPT = 'ADD_GRADER_SAVE_ATTEMPT';
export const CHANGE_ROLE_SUCCESS = 'ADD_GRADER_SAVE_SUCCESS';
export const CHANGE_ROLE_FAILURE = 'ADD_GRADER_SAVE_FAILURE';


export const changeAttempt = function () {
    return {
        type: CHANGE_ROLE_ATTEMPT,
        text: 'Changing user role...'
    };
}

export const changeSuccess = function (data) {
    return {
        type: CHANGE_ROLE_SUCCESS,
        text: 'User role changed',
        data
    };
}

export const changeFailure = function (error) {
    return {
        type: CHANGE_ROLE_FAILURE,
        text: 'Couldn\'t change user role',
        error
    };
}


export const changeUserRole = (user) => {
    return (dispatch) => {
        //dispatch(changeAttempt());
        dispatch(changeSuccess());
        //callApi('/user', 'post', user)
        //    .then(res =>  dispatch(changeSuccess(res)))
        //    .catch(err => dispatch(changeFailure(err.response)));
    }
}

