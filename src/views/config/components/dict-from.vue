<script setup>
import useStore from '@/store/modules/config/dict'
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
            <el-form-item label="配置值">
                <el-input
                    v-model="data.val"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写配置值"
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