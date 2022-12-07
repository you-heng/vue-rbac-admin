<script setup>
import { ref } from 'vue';
import upload from "@/components/use-upload/use-upload.vue"
import { get_item, http, remove_item, set_item, clear_storage } from "@/utils"
import { layer } from '@layui/layer-vue';
import { useRouter } from "vue-router";

const router = useRouter();
const user = get_item('user')
const pass = ref({
    username: user.username
})
const userinfo = ref({
    avatar: user.avatar,
    username: user.username,
    email: user.email,
    phone: user.phone
})
const imgList = ref([user.avatar])

// 更新个人信息
const toUserInfo = () => {
    http({
        method: 'post',
        url: 'console/index/userinfo',
        data: userinfo.value
    }).then((res) => {
        remove_item('user')
        set_item('user', res.data)
        layer.msg(res.msg)
    })
}

// 更新密码
const toPass = () => {
    http({
        method: 'post',
        url: 'console/index/pass',
        data: pass.value
    }).then((res) => {
        layer.msg(res.msg)
        if(res.code == 200){
            setTimeout(() => {
                clear_storage()
                router.push('/login')
            }, 700)
        }
    })
}

// 更新头像
const putImg = (img) => {
    userinfo.value.avatar = img
}
</script>

<template>
    <div class="userinfo">
        <el-tabs tab-position="left" style="height: 200px" class="demo-tabs">
            <el-tab-pane label="基本资料">
                <el-form
                    label-position="top"
                    label-width="100px"
                    style="max-width: 460px"
                    :model="userinfo"
                    class="form-list"
                >
                    <el-form-item label="头像">
                        <upload :imgList="imgList" :number="1" @putImg="putImg" />
                    </el-form-item>
                    <el-form-item label="用户名">
                        <el-input disabled v-model="userinfo.username" placeholder="填写用户名" />
                    </el-form-item>
                    <el-form-item label="邮箱">
                        <el-input v-model="userinfo.email" placeholder="填写邮箱" />
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="userinfo.phone" placeholder="填写手机号码" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="toUserInfo">更新信息</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="安全设置">
                <el-form
                    label-position="top"
                    label-width="100px"
                    style="max-width: 460px"
                    :model="pass"
                    class="form-list"
                >
                    <el-form-item label="旧密码">
                        <el-input v-model="pass.password" placeholder="填写旧密码" />
                    </el-form-item>
                    <el-form-item label="新密码">
                        <el-input v-model="pass.newPassword" placeholder="填写新密码" />
                    </el-form-item>
                    <el-form-item label="确认密码">
                        <el-input v-model="pass.makePassword" placeholder="填写确认密码" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="toPass">更新密码</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<style lang="scss" scoped>
    .userinfo {
        background-color: #fff !important;
        padding: 20px;
        height: 93%;
    }
    .demo-tabs{
        height: auto !important;
    }
    .form-list{
        margin-left: 20px;
    }
</style>