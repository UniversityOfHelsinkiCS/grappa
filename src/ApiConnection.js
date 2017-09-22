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
    return getAxios().get(url);
}
