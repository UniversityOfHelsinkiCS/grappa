import { callApi } from '../../util/apiConnection';

export const AGREEMENT_SAVE_ATTEMPT = 'AGREEMENT_SAVE_ATTEMPT'
export const AGREEMENT_SAVE_SUCCESS = 'AGREEMENT_SAVE_SUCCESS'
export const AGREEMENT_SAVE_FAILURE = 'AGREEMENT_SAVE_FAILURE'

export const saveAttempt = function () {
    return {
        type: AGREEMENT_SAVE_ATTEMPT,
        text: 'Sopimuksen talletus käynnistetty'
    };
}

export const saveSuccess = function (data) {
    return {
        type: AGREEMENT_SAVE_SUCCESS,
        text: 'Sopimus talletettu onnistuneesti',
        data
    };
}

export const saveFailure = function (error) {
    return {
        type: AGREEMENT_SAVE_FAILURE,
        text: 'Sopimuksen talletus epäonnistui',
        error
    };
}

export const saveAgreement = (agreement) => {
    return (dispatch) => {
        dispatch(saveAttempt());
        callApi('/agreements', 'post', agreement)
            .then(res =>  dispatch(saveSuccess(res)))
            .catch(err => dispatch(saveFailure(err.response)));
    }
}

/*export const getAgreement = (agreementId) => {
    return (dispatch) => {
        dispatch(getAttempt());
        callApi('/agreements/' + agreementId, 'get')
            .then(res => dispatch(getSuccess(res)))
            .catch(err => dispatch(getFailure(err.response)));
    //}
}*/
