import { callApi } from '../../util/apiConnection';

export const getAgreement = (agreementId) => {
    const prefix = "GET_ONE_";
    const method = "get";
    return callController(prefix, method);
}

export const saveAgreement = (agreement) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix, method);
}

export const deleteAgreement = (agreement) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method);
}

const action = (suffix, response) => {
    return {
        type: "AGREEMENT_" + suffix,
        response,
    }
}

const callController = (prefix, method, data) => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi('/agreements', method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}