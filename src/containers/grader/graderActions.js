import { callController } from '../../util/apiConnection';

export const saveAddedGrader = (grader) => {
    const route = '/supervisors/save';
    const prefix = "GRADER_SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, grader, method);
}

export const getSupervisors = () => {
    const route = '/supervisors/agreementPersons';
    const prefix = "GRADER_GET_ALL_";
    const method = "get";
    return callController(route, prefix);
}

export const deleteSupervisor = (data) => {
    const route = '/supervisors';
    const prefix = "GRADER_DELETE_ONE_";
    const method = "delete";
    return callController(route, prefix);
}

export const reviewSupervisor = (supervisor) => {
    const route = '/supervisors/review';
    const prefix = "GRADER_REVIEW_ONE_";
    const method = "put";
    return callController(route, prefix, supervisor, method);
}

export const updateSupervisor = (supervisor) => {
    const route = '/supervisors/update';
    const prefix = "GRADER_UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, supervisor, method);
}