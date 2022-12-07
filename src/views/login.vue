<script setup>
import useStore from "@/store/modules/login"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { verify, get_item, setting } from "@/utils"

const router = useRouter();
const store = useStore()
const { user, code, fields } = storeToRefs(store)

store.get_code()

const config = get_item('config') || setting;

//获取验证码
const change_code = () => {
    store.get_code()
}

//点击登陆
const submit = () => {
    console.log()
    if (verify(user.value, fields.value)) {
        store.submit_login(router)
    }
}
</script>

<template>
    <div class="login-list">
        <div class="login-list-div">
            <div class="login-list-h1">{{config.sys_title}}</div>
            <el-form :model="user" label-width="80px" label-position="left" class="login-list-form">
                <el-form-item label="用户名">
                    <el-input v-model="user.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="user.password" type="password" show-password placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="验证码" class="login-list-form-code">
                    <el-input v-model="user.code" placeholder="请输入验证码" />
                    <img :src="code.captcha" class="login-list-form-img" @click="change_code" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit">点击登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>