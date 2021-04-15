import { callController } from '../../../util/apiConnection'

export const getUser = () => {
    const prefix = 'USER_LOGIN_'
    const route = '/user'
    return callController(route, prefix)
}

export const switchEmail = (useSecondaryEmail) => {
    const prefix = 'USER_EMAIL_UPDATE_'
    const route = '/persons/email'
    return callController(route, prefix, { useSecondaryEmail }, 'put')
}

export const graderRoleRequest = (programmeId) => {
    const prefix = 'USER_GRADER_REQUEST_'
    const route = 'roles/grader_request'
    return callController(route, prefix, { programmeId }, 'post')
}
