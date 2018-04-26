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
