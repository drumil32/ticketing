import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const buildClient = (token) => {
    if (typeof window === "undefined") {
        return axios.create({
            baseURL: 'http://auth-cluster-srv:3000',
            headers: {Authorization: 'Bearer ' + token}
        });
    } else {
        return axios.create({
            baseURL: `${publicRuntimeConfig.AUTH_URL}`,
            headers: {Authorization: 'Bearer ' + token}
        });
    }
}

export default buildClient