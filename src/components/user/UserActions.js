import { callApi } from '../../util/apiConnection';

export const CHANGE_ROLE_ATTEMPT = 'CHANGE_ROLE_ATTEMPT';
export const CHANGE_ROLE_SUCCESS = 'CHANGE_ROLE_SUCCESS';
export const CHANGE_ROLE_FAILURE = 'CHANGE_ROLE_FAILURE';

//not actually used atm because it was easier without this... will be used when connected to back end?
export const changeAttempt = function (data) {
    //console.log(data);
    return {
        type: CHANGE_ROLE_ATTEMPT,
        text: 'Changing user role...',
        data
    };
}

export const changeSuccess = function (data) {
    return {
        type: CHANGE_ROLE_SUCCESS,
        text: 'User role changed',
        data,
    };
}

//not actually used atm because it was easier without this... will be used when connected to back end?
export const changeFailure = function (error) {
    return {
        type: CHANGE_ROLE_FAILURE,
        text: 'Couldn\'t change user role',
        error
    };
}


export const changeUserRole = (role) => {
    return (dispatch) => {
        //dispatch(changeAttempt(role));
        dispatch(changeSuccess(role));
        //callApi('/user', 'post', user)
        //    .then(res =>  dispatch(changeSuccess(res)))
        //    .catch(err => dispatch(changeFailure(err.response)));
    }
}

