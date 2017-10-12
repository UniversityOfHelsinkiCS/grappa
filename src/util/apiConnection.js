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

export const get = (url) => {
    return getAxios().get(url);//.then(res => {res.status === 200 ? res : Promise.reject()});
}

const post = (url, data) => {
    return getAxios().post(url, data);//.then(res => {res.status === 200 ? res : Promise.reject()});
}

export const put = (url, data) => {
    return getAxios().put(url, data);//.then(res => {res.status === 200 ? res : Promise.reject()});
}

//todo: switch case for rest; richer argument possibilities
export function callApi(url, method='get', content){
    return (method=='get' ? get(url) : post(url, content));
}
