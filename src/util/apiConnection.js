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

// TODO: DELETE THIS
export const oldPut = (url, content) => {
    return getAxios().put(url, content);
}

//If you feel a sudden urge to call this from outside a Redux Action: Don't.
export function callApi(url, method='get', data){
    switch(method) {
        case "get":
            return getAxios().get(url);
        case "post":
            return getAxios().post(url, data);
        case "put":
            return getAxios().put(url, data).then(res => {res.status === 200 ? res : Promise.reject()});
        case "delete":
            return getAxios().delete(url).then(res => {res.status === 200 ? res : Promise.reject()});
        default:
            console.error("Invalid http method");
    }
}
