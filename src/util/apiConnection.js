import axios from 'axios';

const getAxios = () => {
    if (process.env.API_URL) {
        console.log("API_URL is", process.env.API_URL);
        return axios.create({
            baseURL: process.env.API_URL
        });
    } else {
        return axios;
    }
}

function callApi(url, method = 'get', data, shibbolethId) {
    const header = {
        headers: {
            "shibbolointiId": shibbolethId,
        },
    }
    switch (method) {
        case "get":
            return getAxios().get(url, header);
        case "post":
            return getAxios().post(url, data, header);
        case "put":
            return getAxios().put(url, data, header);
        case "delete":
            return getAxios().delete(url, header);
        default:
            console.error("Invalid http method");
    }
}

export const callController = (route, prefix, data, method = 'get') => dispatch => {
    const payload = {
        route,
        method,
        data,
        prefix
    }
    dispatch({ type: prefix + "ATTEMPT", payload });
}

//If you feel a sudden urge to call this. Don't.
export const handleRequest = store => next => action => {
    next(action);
    const payload = action.payload;
    if (payload) {
        const shibbolethId = store.getState().user.shibbolethId
        callApi(payload.route, payload.method, payload.data, shibbolethId)
            .then(res => store.dispatch({ type: payload.prefix + "SUCCESS", response: res.data }))
            .catch(err => store.dispatch({ type: payload.prefix + "FAILURE", response: err }));
    }
}
