import axios from 'axios';

const getAxios = () => {
    if (process.env.API_URL) {
        console.log('API_URL is', process.env.API_URL);
        return axios.create({
            baseURL: process.env.API_URL
        });
    } else {
        return axios;
    }
}

function callApi(url, method = 'get', data, prefix) {
    if (prefix.includes("DOWNLOAD")) {
        return getAxios().get(url, { responseType: "arraybuffer" });
    }
    switch (method) {
        case 'get':
            return getAxios().get(url);
        case 'post':
            return getAxios().post(url, data);
        case 'put':
            return getAxios().put(url, data);
        case 'delete':
            return getAxios().delete(url);
        default:
            console.error('Invalid http method');
    }
}

export const callController = (route, prefix, data, method = 'get') => dispatch => {
    const payload = {
        route,
        method,
        data,
        prefix
    }
    dispatch({ type: prefix + 'ATTEMPT', payload });
}

//If you feel a sudden urge to call this. Don't.
export const handleRequest = store => next => action => {
    next(action);
    const payload = action.payload;
    if (payload) {
        callApi(payload.route, payload.method, payload.data, payload.prefix)
            .then(res => {
                store.dispatch({ type: payload.prefix + 'SUCCESS', response: res.data })
            })
            .catch(err => store.dispatch({ type: payload.prefix + 'FAILURE', response: err }));
    }
}
