<script setup>
import useStore from '@/store/modules/system/auth'
import { storeToRefs } from 'pinia';
import { verify } from "@/utils"

const store = useStore()
const { dialog, data, fields, auths, lattice } = storeToRefs(store)

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
    if(data.value.is_menu === 1){
        fields.value.icon = '请填写字体图标';
    }else{
        delete fields.value.icon
    }
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
            <el-form-item label="权限名">
                <el-input v-model="data.title" placeholder="请填写权限名" />
            </el-form-item>
            <el-form-item label="父级">
                <el-cascader
                v-model="data.p_ids"
                :options="auths"
                :props="lattice"
                :show-all-levels="false"
                placeholder="请选择父级"
                clearable
                filterable
                />
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="data.is_menu">
                <el-radio :label="1" border>菜单</el-radio>
                <el-radio :label="2" border>权限</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="字体图标" v-if="!data.is_menu || data.is_menu == 1">
                <el-input v-model="data.icon" placeholder="请填写字体图标" />
            </el-form-item>
            <el-form-item label="地址">
                <el-input v-model="data.path" placeholder="请填写地址" />
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