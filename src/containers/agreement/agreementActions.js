import { callController } from '../../util/apiConnection';

export const getAgreements = () => {
    const prefix = "AGREEMENT_GET_ALL_";
    const route = "/agreements"
    return callController(route, prefix)
}

export const getAgreement = (agreementId) => {
    const prefix = "AGREEMENT_GET_ONE_";
    const route = "/agreements/" + agreementId
    return callController(route, prefix)
}

export const saveAgreement = (agreement) => {
    const prefix = "AGREEMENT_SAVE_ONE_";
    const method = "post";
    const route = '/agreements'
    return callController(route, prefix, agreement, method)
}

export const saveAgreementDraft = (agreementDraft) => {
    console.log(agreementDraft);
    const prefix = "AGREEMENT_DRAFT_SAVE_ONE";
    const method = "post";
    const route = '/agreement-drafts';
    return callController(route, prefix, agreementDraft, method);
}

export const saveAttachment = (attachment, agreement) => {
    const prefix = "ATTACHMENT_SAVE_ONE_";
    const method = "post";
    const route = "/attachments" //+ attachment[0];
    console.log("actions, attachment", attachment)
    return callController(route, prefix, attachment, method);
}

/*export const saveAttachment = (attachments, agreementId) => {
    const prefix = "ATTACHMENT_SAVE_ONE_";
    const method = "post";
    const route = "/attachments/" + agreementId;
    return callController(route, prefix, attachments, method);
}*/

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