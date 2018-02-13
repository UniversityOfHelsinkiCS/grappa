import { callController } from '../../../util/apiConnection'

export const login = (shibbolethId) => {
    const prefix = 'USER_LOGIN_'
    const route = shibbolethId ? `/user/${shibbolethId}` : '/user/login'
    return callController(route, prefix)
}

export const logout = () => {
    const prefix = 'USER_LOGOUT_'
    const route = '/user/logout'
    return callController(route, prefix)
}
