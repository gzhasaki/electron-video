import Vue from "vue";
import axios from 'axios'
import ElementUI from 'element-ui';
const service = axios.create({

    // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 10000 // request timeout
})

service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        return  response.data;
    },
    error => {
        return Promise.reject(error)
    }
)

export const get = (url, param) => {
    let str = param2Str(param);
    if (str) {
        url = url + "?" + str;
    }
    return service({
        method: 'get',
        url: url,
        data: param || {}
    })
}

const param2Str = (param) => {
    if (param) {
        return Object.keys(param).map(function (key) {
            // body...
            return encodeURIComponent(key) + "=" + encodeURIComponent(param[key]);
        }).join("&");
    }
    return null;
}
