import axios from "axios";
import { get_item, loading } from "@/utils";
import { layer } from "@layui/layer-vue";

const http = axios.create({
    baseURL: "/api",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

const code = [
    401, // 没有权限
    402, // token过期
    403, // token失效
]

// 请求前
http.interceptors.request.use(
    function (config) {
        loading()
        let user = get_item('user')
        if(user){
            config.headers['uniquid'] = user.uniquid
        }
        config.headers["token"] =
            get_item("token") === undefined ? "" : get_item("token");
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 响应前
http.interceptors.response.use(
    function (response) {
        loading(true)
        if(code.indexOf(response.data.code) > -1){
            layer.msg(response.data.msg)
        }
        return response.data;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default http;
