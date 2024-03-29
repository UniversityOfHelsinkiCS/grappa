import axios from 'axios'
import { getToken, setToken } from './common'
import { TOKEN_NAME, MOCK_USER } from './constants'

const createApiUrl = (path) => {
    const API_PATHS = ['grappa']
    const mode = path.split('/')[1]
    return API_PATHS.includes(mode) ? `/${mode}/api` : '/api'
}
// Problems with api base path: /v2 or /api or even /
export const getAxios = () => {
    const hostUrl = window.location.origin
    const apiPath = createApiUrl(window.location.pathname)
    return axios.create({
        baseURL: `${hostUrl}${apiPath}`
    })
}

const isDevEnv = process.env.NODE_ENV === 'development'

const devDefaultOptions = {
    headers: {
        uid: 'dev',
        'unique-code': 'urn:schac:personalUniqueCode:int:studentID:helsinki.fi:012345678',
        givenname: 'Etunimi',
        sn: 'Sukunimi',
        mail: 'testi-email@example.com',
        'shib-session-id': 'mock-session',
        eduPersonAffiliation: 'student;member;staff;employee'
    }
}

const getRequestOptions = () => {
    const mockUserShibId = localStorage.getItem(MOCK_USER)
    const options = isDevEnv ? devDefaultOptions : { headers: {} }
    return mockUserShibId
        ? { ...options, headers: { ...options.headers, 'x-mock-user-id': mockUserShibId } }
        : options
}

export const login = async () => {
    const options = getRequestOptions()
    const response = await getAxios().post('/login', null, options)
    return response.data.token
}

export const swapMockUser = async (newUserShibId) => {
    if (newUserShibId) {
        localStorage.setItem(MOCK_USER, newUserShibId)
    } else {
        localStorage.removeItem(MOCK_USER)
    }

    const token = await login()
    setToken(token)
}

export const callApi = async (url, method = 'get', data, prefix) => {
    const options = getRequestOptions()
    const token = await getToken()
    options.headers['x-access-token'] = token

    if (prefix && prefix.includes('DOWNLOAD')) {
        options.responseType = 'arraybuffer'
        return getAxios().get(url, options)
    }

    switch (method) {
        case 'get':
            return getAxios().get(url, options)
        case 'post':
            return getAxios().post(url, data, options)
        case 'put':
            return getAxios().put(url, data, options)
        case 'delete':
            return getAxios().delete(url, options)
        default:
            return Promise.reject(new Error('Invalid http method'))
    }
}

// @params agrument here is purely used as metadata, and is needed
// so that handleRequest() below has access to values of individual
// path parameters. It might need to use them for example to
// pass them further to reducers. This way reducers have access
// to values of path params.
export const callController = (route, prefix, data, method = 'get', query, params = {}) => {
    const requestSettings = {
        route,
        method,
        data,
        prefix,
        query,
        params
    }
    return { type: `${prefix}ATTEMPT`, requestSettings }
}

export const handleRequest = store => next => async (action) => {
    next(action)
    const { requestSettings } = action
    if (requestSettings) {
        const {
            route, method, data, prefix, query, params
        } = requestSettings
        try {
            const res = await callApi(route, method, data, prefix)
            store.dispatch({ type: `${prefix}SUCCESS`, response: res.data, query, params })
        } catch (e) {
            // Something failed. Assume it's the token and try again.
            try {
                await getToken(true)
                const res = await callApi(route, method, data, prefix)
                store.dispatch({ type: `${prefix}SUCCESS`, response: res.data, query })
            } catch (err) {
                store.dispatch({ type: `${prefix}FAILURE`, response: err, query })
            }
        }
    }
}

export const logout = async () => {
    const stagingPath = '/grappa'
    const returnUrl = window.location.pathname.includes(stagingPath) ?
        `${window.location.origin}${stagingPath}` : window.location.origin
    const response = await getAxios().delete('/logout', { data: { returnUrl } })
    localStorage.removeItem(TOKEN_NAME)
    window.location = response.data.logoutUrl
}

export const sendLog = async data => callApi('/log', 'post', data)
