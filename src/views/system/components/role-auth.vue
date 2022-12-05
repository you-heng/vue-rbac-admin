<script setup>
import useStore from '@/store/modules/system/role'
import { layer } from '@layui/layer-vue';
import { storeToRefs } from 'pinia';

const store = useStore()
const { dialog, authList, auths, lattice } = storeToRefs(store)

store.$patch({
    data: {sort: 0}
})

// 关闭
const handleClose = () => {
    store.$patch({
        dialog: {
            authDialogVisible: false,
        }
    })
}

// 点击权限
const clickAuth = (checkedNodes, checkedKeys) => {
  store.$patch({
    auths: {
        menu_ids: checkedKeys.halfCheckedKeys,
        auth_ids: checkedKeys.checkedKeys
    },
  });
};

// 提交表单
const clickButton = () => {
    if(auths.value.length == 0){
        layer.msg('请选择权限再提交!')
        return false;
    }
    store.auth();
}
</script>

<template>
    <el-dialog
        v-model="dialog.authDialogVisible"
        :title="dialog.title"
        width="25%"
        :before-close="handleClose"
        :draggable="true"
    >
        <el-form
            ref="refRules"
            :model="auths"
            label-width="100px"
            label-position="left"
        >
            <el-tree
                ref="treeRef"
                :data="authList"
                show-checkbox
                node-key="id"
                highlight-current
                :props="lattice"
                :default-checked-keys="auths.auth_ids"
                @check="clickAuth"
            />
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="clickButton">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>