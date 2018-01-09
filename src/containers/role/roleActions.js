import { callController } from '../../util/apiConnection';

export const saveRole = role => {
    const route = '/roles';
    const prefix = 'ROLE_SAVE_ONE_';
    const method = 'post';
    return callController(route, prefix, role, method);
}

export const deleteRole = role => {
    const route = '/roles';
    const prefix = 'ROLE_DELETE_ONE_';
    const method = 'delete';
    return callController(route, prefix, role, method);
}

export const updateRole = role => {
    const route = '/roles';
    const prefix = 'ROLE_UPDATE_ONE_';
    const method = 'put';
    return callController(route, prefix, role, method);
}

export const updateVisitorRoles = role => {
    const route = '/roles/visitor';
    const prefix = 'ROLE_VISITOR_UPDATE_';
    const method = 'put';
    return callController(route, prefix, role, method);
}
