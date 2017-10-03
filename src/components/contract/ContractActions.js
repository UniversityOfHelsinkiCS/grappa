import callApi from '../../util/apiConnection';

export const CONTRACT_SAVE_ATTEMPT = 'CONTRACT_SAVE_ATTEMPT'
export const CONTRACT_SAVE_SUCCESS = 'CONTRACT_SAVE_SUCCESS'
export const CONTRACT_SAVE_FAILURE = 'CONTRACT_SAVE_FAILURE'

export const saveAttempt = function () {
    return {
        type: CONTRACT_SAVE_ATTEMPT,
        text: 'Sopimuksen talletus käynnistetty'
    };
}

export const saveSuccess = function () {
    return {
        type: CONTRACT_SAVE_SUCCESS,
        text: 'Sopimus talletettu onnistuneesti'
    };
}

export const saveFailure = function () {
    return {
        type: CONTRACT_SAVE_FAILURE,
        text: 'Sopimuksen talletus epäonnistui'
    };
}

export const saveContract = (contract) => {
    return (dispatch) => {
        dispatch(saveAttempt());
        callApi('/contract', 'post', contract)
            .then(res =>  dispatch(saveSuccess()))
            .catch(err => dispatch(saveFailure()));
    }
}
