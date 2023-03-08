<script setup>
import useStore from '@/store/modules/config/black-list'
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
            <el-form-item label="ip地址">
                <el-input v-model="data.ip" placeholder="请填写ip地址" />
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="data.is_type">
                <el-radio :label="1" border>永久拉黑</el-radio>
                <el-radio :label="2" border>暂时拉黑</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="到期时间" v-if="!data.is_type || data.is_type == 2">
                <el-date-picker
                    v-model="data.time"
                    type="date"
                    placeholder="请选择到期时间"
                    style="width: 60%"
                    value-format="YYYY-MM-DD"
                />
            </el-form-item>
            <el-form-item label="冻结理由">
                <el-input
                    v-model="data.reason"
                    :rows="3"
                    type="textarea"
                    placeholder="请填写冻结理由"
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