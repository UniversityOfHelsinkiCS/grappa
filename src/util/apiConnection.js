import axios from 'axios';

const getAxios = () => {
    if (process.env.API_URL) {
        console.log("not undefined");
        return axios.create({
            baseURL: process.env.API_URL
        });
    } else {
        return axios;
    }
}

// DO NOT EXPORT
const get = (url) => {
    return getAxios().get(url)//.then(res => {res.status === 200 ? res : Promise.reject()});
}

// DO NOT EXPORT
const post = (url, data) => {
    return getAxios().post(url, data)//.then(res => {res.status === 200 ? res : Promise.reject()});
}

const put = (url, data) => {
    return getAxios().put(url, data).then(res => {res.status === 200 ? res : Promise.reject()});
}

export const oldPut = (url, content) => {
    return getAxios().put(url, content);
}

//delete is an operator => can't use it as const name
const remove = (url) => {
    return getAxios().delete(url).then(res => {res.status === 200 ? res : Promise.reject()});
}

//todo: switch case for rest; richer argument possibilities
export function callApi(url, method='get', content){
    switch(method) {
        case "get":
            return get(url);
        case "post":
            return post(url, content);
        case "put":
            return put(url, content);
        case "delete":
            return remove(url);
        default:
            console.error("Invalid http method");
    }
}
