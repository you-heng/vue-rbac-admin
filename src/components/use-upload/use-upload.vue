<script setup>
import { ref } from "vue";
import { setting, get_item } from "@/utils"
import { layer } from "@layui/layer-vue";

const props = defineProps({
    imgList: {
        type: Array,
        default: () => {}
    },
    number: {
        type: Number,
        default: 1
    }
})

const emit = defineEmits(['putImg'])
const fileList = ref([...props.imgList])
const preview = ref([...props.imgList])
const token = get_item('token')
const user = get_item('user')
const headers = ref({ "token": token, "uniquid": user.uniquid })

const onPreview = (e) => {
    let imgList = []
    preview.value.filter((item) => {
        imgList.push({ src: item.url })
    })
    layer.photos({
        imgList: [...imgList]
    })
}

// 删除前执行
const beforeRemove = (e) => {
    let hash = ''
    if(e.response){
        hash = e.response.data.hash
    }else{
        hash = e.name
    }
    preview.value = preview.value.filter((item) => item.name != hash)
}

// 上传成功
const handleAvatarSuccess = (e) => {
    let img = {
        name: e.data.hash,
        url: e.data.key
    }
    preview.value.push(img)
    emit('putImg', img)
    layer.msg(e.msg)
}

// 上传前验证
const beforeAvatarUpload = (e) => {
    if(setting.upload_list.type.indexOf(e.type) === -1){
        layer.msg('请上传 ' + setting.upload_list.type + ' 格式的图片', {time: 2000})
        return false
    }
    if(e.size > setting.upload_list.size){
        layer.msg('图片大小不能超过' + setting.upload_list.size / 1024 / 1024 + 'M' , {time: 2000})
        return false
    }
}
</script>

<template>
    <el-upload
        name="file"
        class="avatar-uploader"
        list-type="picture-card"
        v-model:file-list="fileList"
        :action="setting.upload"
        :limit="props.number"
        :on-preview="onPreview"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :before-remove="beforeRemove"
        :headers="headers"
    >
        <i class="iconfont icon-shangchuan icon-upload"></i>
    </el-upload>
</template>

<style lang="scss">
.uploader-img{
    width: 20rem;
    height: 20rem;
}
.icon-upload{
    font-size: 5rem;
    color: #8c939d;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  width: 15rem;
  height: 15rem;
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>