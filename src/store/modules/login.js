import { defineStore } from "pinia"
import { set_item, http, setting } from "@/utils"
import { layer } from "@layui/layer-vue"

const loginStore = defineStore('loginStore', {
    state: () => {
        return {
            user: {},
            code: {},
            fields: {
                username: "请填写用户名",
                password: "请填写密码",
                code: "请填写验证码"
            }
        }
    },
    actions: {
        // 登录
        submit_login(router) {
            http({
                method: 'post',
                url: 'console/index/login',
                data: {
                    username: this.user.username,
                    password: this.user.password,
                    code: this.user.code,
                    key: this.code.key
                }
            }).then((res) => {
                layer.msg(res.msg)
                if(res.code === 200){
                    set_item('token', res.data.token);
                    set_item('user', res.data)
                    this.get_config()
                    setTimeout(() => {
                        router.push('/')
                    }, 500)
                }
            })
        },
        // 验证码
        get_code() {
            http({
                method: 'get',
                url: 'console/index/captcha',
                params: {}
            }).then((res) => {
                let data = JSON.parse(res)
                this.code = data
            })
        },
        // 系统设置
        get_config() {
            http({
                method: 'get',
                url: 'console/index/config',
                params: {}
            }).then((res) => {
                let config = {}
                if(res.code == 200){
                    data = res.data
                }else{
                    config = {
                        'sys_title': setting.sys_title,
                        'sys_logo' : setting.sys_logo
                    }
                }
                set_item('config', config)
            })
        }
    }
})

export default loginStore