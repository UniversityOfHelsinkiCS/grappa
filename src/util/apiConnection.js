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

//todo: switch case for rest; richer argument possibilities
export function callApi(url, method='get', content){
    return (method=='get' ? get(url) : post(url, content));
}
