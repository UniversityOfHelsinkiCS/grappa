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

//If you feel a sudden urge to call this from outside a Redux Action: Don't.
export function callApi(url, method='get', data){
    switch(method) {
        case "get":
            return getAxios().get(url);
        case "post":
            return getAxios().post(url, data);
        case "put":
            return getAxios().put(url, data);
        case "delete":
            return getAxios().delete(url);
        default:
            console.error("Invalid http method");
    }
}
