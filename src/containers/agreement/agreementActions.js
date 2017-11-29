import { callController } from '../../util/apiConnection';

export const getAgreement = (agreementId) => {
    const prefix = "AGREEMENT_GET_ONE_";
    const method = "get";
    const route = "/agreements/" + agreementId
    return callController(route, prefix)
}

export const saveAgreement = (agreement) => {
    const prefix = "AGREEMENT_SAVE_ONE_";
    const method = "post";
    const route = '/agreements'
    return callController(route, prefix, agreement, method)
}

export const saveAttachment = (attachments, agreementId) => {
    const prefix = "ATTACHMENT_SAVE_ONE_";
    const method = "post";
    const route = "/attachments/" + agreementId;
    return callController(route, prefix, attachments, method);
}

export const deleteAgreement = (agreementId) => {
    const prefix = "AGREEMENT_DELETE_ONE_";
    const method = "delete";
    const route = '/agreements/' + agreementId;
    return callController(route, prefix, agreementId, method)
}

export const updateAgreement = (agreement) => {
    const prefix = "AGREEMENT_UPDATE_ONE_";
    const method = "put";
    const route = "/agreements/" + agreement.agreementId
    return callController(route, prefix, agreement, method)
}