import { callController } from '../../util/apiConnection';

export const getSupervisors = () => {
    const prefix = "SUPERVISOR_GET_ALL_";
    const method = "get";
    const route = "/supervisors"
    return callController(route, prefix);
}