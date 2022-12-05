<script setup>
import useStore from '@/store/modules/system/admin'
import { storeToRefs } from 'pinia';
import { verify } from '@/utils';

const store = useStore()
const { dialog, data, fields, teamList, lattice, roleList, jobList, jobLattice } = storeToRefs(store)

store.$patch({
    data: {sort: 0}
})

// 关闭弹窗
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
            <el-form-item label="用户名">
                <el-input v-model="data.username" placeholder="请填写用户名" />
            </el-form-item>
            <el-form-item label="角色">
                <el-checkbox-group v-model="data.role_ids" size="small">
                <el-checkbox
                    v-for="role in roleList"
                    :label="role.role_name"
                    :value="role.id"
                    border
                />
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="部门">
                <el-cascader
                    placeholder="请选择部门"
                    v-model="data.team_ids"
                    :options="teamList"
                    :props="lattice"
                    :show-all-levels="false"
                    clearable
                    filterable
                />
            </el-form-item>
            <el-form-item label="职位">
                <el-cascader
                    placeholder="请选择职位"
                    v-model="data.job_id"
                    :options="jobList"
                    :props="jobLattice"
                    :show-all-levels="false"
                    clearable
                    filterable
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