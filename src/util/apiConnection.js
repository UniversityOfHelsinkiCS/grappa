import axios from 'axios'

export const getAxios = () => {
    if (process.env.API_URL) {
        return axios.create({
            baseURL: process.env.API_URL
        })
    }
    return axios
}

function callApi(url, method = 'get', data, prefix, token) {
    const headers = {
        'x-access-token': token
    }
    if (prefix.includes('DOWNLOAD')) {
        headers.responseType = 'arraybuffer'
        return getAxios().get(url, headers)
    }
    switch (method) {
        case 'get':
            return getAxios().get(url, headers)
        case 'post':
            return getAxios().post(url, data, headers)
        case 'put':
            return getAxios().put(url, data, headers)
        case 'delete':
            return getAxios().delete(url, headers)
        default:
            return Promise.reject(new Error('Invalid http method'))
    }
}

export const callController = (route, prefix, data, method = 'get') => (dispatch) => {
    const payload = {
        route,
        method,
        data,
        prefix
    }
    dispatch({ type: `${prefix}ATTEMPT`, payload })
}

// If you feel a sudden urge to call this. Don't.
export const handleRequest = store => next => (action) => {
    next(action)
    const { payload } = action
    if (payload) {
        callApi(payload.route, payload.method, payload.data, payload.prefix, store.getState().user.token)
            .then((res) => {
                store.dispatch({ type: `${payload.prefix}SUCCESS`, response: res.data })
            })
            .catch(err => store.dispatch({ type: `${payload.prefix}FAILURE`, response: err }))
    }
}
