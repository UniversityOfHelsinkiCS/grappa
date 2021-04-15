import { callController } from '../../../util/apiConnection'

export const getAvailableRoles = () => {
    const route = '/roles/available'
    const prefix = 'AVAILABLEROLES_GET_ALL_'
    return callController(route, prefix)
}

export const saveRole = (role) => {
    const route = '/roles'
    const prefix = 'ROLE_SAVE_ONE_'
    const method = 'post'
    return callController(route, prefix, role, method)
}

export const deleteRole = (role) => {
    const route = `/roles/${role.personRoleId}`
    const prefix = 'ROLE_DELETE_ONE_'
    const method = 'delete'
    return callController(route, prefix, role, method)
}

export const updateRole = (role) => {
    const route = '/roles'
    const prefix = 'ROLE_UPDATE_ONE_'
    const method = 'put'
    return callController(route, prefix, role, method)
}

export const getRoleRequestsAction = () => {
    const route = '/roles/requests'
    const prefix = 'ROLE_GET_REQUESTS_'
    const method = 'get'
    return callController(route, prefix, method)
}

export const grantRoleAction = (data) => {
    const route = '/roles/requests'
    const prefix = 'ROLE_GRANT_ONE_'
    const method = 'post'
    return callController(route, prefix, data, method)
}
