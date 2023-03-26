<script setup>
import useStore from '@/store/modules/config/dict'
import upload from "@/components/use-upload/use-upload.vue"
import { storeToRefs } from 'pinia';
import { verify } from "@/utils"

const store = useStore()
const { dialog, data, fields } = storeToRefs(store)

store.$patch({
    data: {sort: 0}
})

// 关闭
const handleClose = () => {
    store.$patch({
        dialog: {
            dialogVisible: false,
        }
    })
}

// 提交表单
const clickButton = () => {
    if(verify(data.value, fields.value)){
        if(dialog.value.title == '添加'){
            store.create()
        }else if(dialog.value.title == '编辑'){
            store.update()
        }
    }
}

// 更新头像
const putImg = (img) => {
    store.$patch({
        val: img
    })
}
</script>

<template>
    <el-dialog
        v-model="dialog.dialogVisible"
        :title="dialog.title"
        width="45%"
        :before-close="handleClose"
        :draggable="true"
    >
        <el-form
            ref="refRules"
            :model="data"
            label-width="100px"
            label-position="left"
        >
            <el-form-item label="配置名">
                <el-input
                    v-model="data.key"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写配置名"
                />
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="data.is_type">
                <el-radio :label="1" border>text</el-radio>
                <el-radio :label="2" border>json</el-radio>
                <el-radio :label="3" border>图片</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="配置值" v-if="data.is_type == 1">
                <el-input
                    v-if="typeof(data.val) == 'string' || data.val == null || data.val == undefined"
                    v-model="data.val"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写配置值"
                />
            </el-form-item>
            <el-form-item label="配置值" v-else-if="data.is_type == 2">
                <el-input
                    v-if="typeof(data.val) == 'string' || data.val == null || data.val == undefined"
                    v-model="data.val"
                    :rows="3"
                    type="textarea"
                    placeholder="json类型的值使用+号分割"
                />
            </el-form-item>
            <el-form-item label="头像" v-else-if="data.is_type == 3">
                <upload v-if="data.val == null || data.val == undefined" :imgList="[]" :number="1" @putImg="putImg" />
                <upload v-else :imgList="typeof(data.val) == 'string' ? [] : [data.val]" :number="1" @putImg="putImg" />
            </el-form-item>
            <el-form-item label="备注">
                <el-input
                    v-model="data.remark"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写备注"
                />
            </el-form-item>
            <el-form-item label="排序">
                <el-input-number v-model="data.sort" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="clickButton">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>