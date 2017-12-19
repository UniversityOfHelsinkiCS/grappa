import { callController } from '../../util/apiConnection';

export const login = (shibbolethId) => {
    const prefix = "USER_LOGIN_";
    const route = shibbolethId ? '/login/' + shibbolethId : '/login';
    return callController(route, prefix);
}