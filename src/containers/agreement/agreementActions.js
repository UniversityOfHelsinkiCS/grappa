import { callApi } from '../../util/apiConnection';

export const getAgreement = (agreementId) => {
    const prefix = "GET_ONE_";
    const method = "get";
    const route = "/agreements/" + agreementId
    return callController(prefix, method, agreementId, route);
}

export const saveAgreement = (agreement) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callController(prefix,method,agreement);
}

export const saveAttachment = (attachments) => {
    const prefix = "SAVE_ONE_";
    const method = "post";
    return callAttachmentController(prefix,method,attachments);
}

export const deleteAgreement = (agreement) => {
    const prefix = "DELETE_ONE_";
    const method = "delete";
    return callController(prefix, method, agreement);
}

export const updateAgreement = (agreement) => {
    const prefix = "UPDATE_ONE_";
    const method = "put";
    const route = "/agreements/" + agreement.agreementId
    return callController(prefix,method, agreement, route)
}

const action = (suffix, response) => {
    return {
        type: "AGREEMENT_" + suffix,
        response,
    }
}

//shpuld res be res.data and err err.response?
const callAttachmentController = (prefix, method, data, route = '/attachments/1') => (dispatch) => {
    dispatch({type: "ATTACHMENT_SAVE_ONE_ATTEMPT"});
    callApi(route, method, data)
        .then(res => dispatch({type: "ATTACHMENT_SAVE_ONE_SUCCESS", res}))
        .catch(err => dispatch({type: "ATTACHMENT_SAVE_ONE_FAILURE", err}));
}

const callController = (prefix, method, data, route = '/agreements') => (dispatch) => {
    dispatch(action(prefix + "ATTEMPT"));
    callApi(route, method, data)
        .then(res => dispatch(action(prefix + "SUCCESS", res.data)))
        .catch(err => dispatch(action(prefix + "FAILURE", err.response)));
}
