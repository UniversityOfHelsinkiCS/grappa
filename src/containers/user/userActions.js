import { callController } from '../../util/apiConnection';

export const login = (shibbolethId) => {
    const prefix = "USER_LOGIN_";
    const route = shibbolethId ? '/login/' + shibbolethId : '/login';
    return callController(route, prefix);
}

export const getAllPersons = (data) => {
    const prefix = "USER_GET_ALL_";
    return callController('/persons', prefix);
}