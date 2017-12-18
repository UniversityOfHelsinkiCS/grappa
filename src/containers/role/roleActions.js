import { callController } from '../../util/apiConnection';

export const saveAddedGrader = (grader) => {
    const route = '/graders';
    const prefix = "ROLE_SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, grader, method);
}

export const getGraders = () => {
    const route = '/graders';
    const prefix = "ROLE_GET_ALL_";
    const method = "get";
    return callController(route, prefix);
}

export const deleteGrader = (graderId) => {
    const route = '/graders/' + graderId;
    const prefix = "ROLE_DELETE_ONE_";
    const method = "delete"
    return callController(route, prefix);
}

export const updateGrader = (grader) => {
    const route = '/graders';
    const prefix = "ROLE_UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, grader, method);
}

//all users who are supervisors
export const getSupervisors = () => {
    const route = '/supervisors';
    const prefix = "SUPERVISOR_GET_ALL_";
    return callController(route, prefix);
}

export const saveAddedSupervisor = (supervisor) => {
    const route = '/supervisors';
    const prefix = "SUPERVISOR_SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, supervisor, method);
}

export const deleteSupervisor = (supervisorId) => {
    const route = '/supervisors';
    const prefix = "SUPERVISOR_DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix, supervisorId, method);
}

//all users supervising a thesis atm
export const getAgreementPersons = () => {
    const route = '/supervisors/agreementPersons';
    const prefix = "SUPERVISOR_GET_AGREEMENT_PERSONS_";
    return callController(route, prefix);
}

export const reviewSupervisor = (supervisor) => {
    const route = '/supervisors/review';
    const prefix = "SUPERVISOR_REVIEW_ONE_";
    const method = "put";
    return callController(route, prefix, supervisor, method);
}

export const updateSupervisor = (supervisor) => {
    const route = '/supervisors/' + supervisor.personId;
    const prefix = "SUPERVISOR_UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, supervisor, method);
}