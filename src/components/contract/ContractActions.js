import { callApi } from '../../util/apiConnection';

export const CONTRACT_SAVE_ATTEMPT = 'CONTRACT_SAVE_ATTEMPT'
export const CONTRACT_SAVE_SUCCESS = 'CONTRACT_SAVE_SUCCESS'
export const CONTRACT_SAVE_FAILURE = 'CONTRACT_SAVE_FAILURE'

export const saveAttempt = function () {
    return {
        type: CONTRACT_SAVE_ATTEMPT,
        text: 'Sopimuksen talletus käynnistetty'
    };
}

export const saveSuccess = function (data) {
    return {
        type: CONTRACT_SAVE_SUCCESS,
        text: 'Sopimus talletettu onnistuneesti',
        data
    };
}

export const saveFailure = function (error) {
    return {
        type: CONTRACT_SAVE_FAILURE,
        text: 'Sopimuksen talletus epäonnistui',
        error
    };
}

export const saveContract = (contract) => {
    return (dispatch) => {
        dispatch(saveAttempt());
        callApi('/contract', 'post', contract)
            .then(res =>  dispatch(saveSuccess(res)))
            .catch(err => dispatch(saveFailure(err.response)));
    }
}

/*export const getAgreement = (agreementId) => {
    return (dispatch) => {
        dispatch(getAttempt());
        callApi('/agreement/' + agreementId, 'get')
            .then(res => dispatch(getSuccess(res)))
            .catch(err => dispatch(getFailure(err.response)));
    //}
}*/
