import { callController } from '../../util/apiConnection';

export const saveAddedGrader = (grader) => {
    const route = '/graders';
    const prefix = "GRADER_SAVE_ONE_";
    const method = "post";
    return callController(route, prefix, grader, method);
}

export const getGraders = () => {
    const route = '/graders';
    const prefix = "GRADER_GET_ALL_";
    const method = "get";
    return callController(route, prefix);
}

export const deleteGrader = (graderId) => {
    const route = '/graders/' + graderId;
    const prefix = "GRADER_DELETE_ONE_";
    const method = "delete"
    return callController(route, prefix);
}

export const updateGrader = (grader) => {
    const route = '/graders';
    const prefix = "GRADER_UPDATE_ONE_";
    const method = "put";
    return callController(route, prefix, grader, method);
}