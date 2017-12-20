import { callController } from '../../util/apiConnection';

export const login = (shibbolethId) => {
    const prefix = "USER_LOGIN_";
    const route = shibbolethId ? '/login/' + shibbolethId : '/login';
    return callController(route, prefix);
}

export const logout = () => {
    const prefix = "USER_LOGOUT_";
    const route = "/logout"
    return callController(route, prefix);
}