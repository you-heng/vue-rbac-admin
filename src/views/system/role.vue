<script setup>
import useStore from "@/store/modules/system/role"
import { storeToRefs } from "pinia";
import TableForm from "./components/role-from.vue";
import AuthFrom from "./components/role-auth.vue"
import { layer } from "@layui/layer-vue";
import { remove_field } from "@/utils"

const store = useStore()
const { roleList, selectValue, selectList, pagination, searchValue, ids, data } = storeToRefs(store)

store.get_list()

// 新增
const create = () => {
    let from = remove_field(data.value)
    from.sort = 0
    store.$patch({
        dialog: {
            dialogVisible: true,
            title: '添加'
        },
        data: from
    })
}

// 修改
const update = (index, row) => {
    store.$patch({
        dialog: {
            dialogVisible: true,
            title: '编辑'
        },
        data: {...row}
    })
}

// 授权
const auth = (index, row) => {
    store.auth_list()
    store.$patch({
        dialog: {
            authDialogVisible: true,
            title: '授权'
        },
        role_id: row.id,
        data: {
            auth_ids: row.auth_ids
        },
        auths: {
            menu_ids: row.menu_ids,
            auth_ids: row.auth_ids
        }
    })
}

// 删除
const remove = (index, row) => {
    layer.confirm('确定要删除当前项吗?', {
        title: '提示',
        btn: [
            {text: '取消', callback: function(id){ layer.close(id) }},
            {text: '确定', callback: function(id){
                store.remove(index, row, id)
            }}
        ]
    })
}

// 批量导出
const batch_down = () => {
    if(ids.value.length === 0){
        layer.msg('请选择需要导出的项')
        return false
    }
    store.batch_down()
}

// 批量删除
const batch_remove = () => {
    if(ids.value.length === 0){
        layer.msg('请选择需要删除的项')
        return false
    }
    layer.confirm('确定要删除这些项吗?', {
        title: '提示',
        btn: [
            {text: '取消', callback: function(id){ layer.close(id) }},
            {text: '确定', callback: function(id){
                store.batch_remove(id)
            }}
        ]
    })
}

// 删除全部
const remove_all = () => {
    layer.confirm('确定要清空当前表中的全部数据吗?', {
        title: '提示',
        btn: [
            {text: '取消', callback: function(id){ layer.close(id) }},
            {text: '确定', callback: function(id){
                store.remove_all(id)
            }}
        ]
    })
}

// 多选
const handleSelectionChange = (e) => {
    let ids = []
    e.filter((item) => {
        ids.push(item.id)
    })
    ids = ids.filter((item) => item != 1)
    store.$patch({
        ids: ids
    })
}

// 根据分页大小
const handleSizeChange = (e) => {
    store.$patch({
        pagination: {
            limit: e
        }
    })
    store.get_list()
}

// 根据分页
const handleCurrentChange = (e) => {
    store.$patch({
        pagination: {
            page: e
        }
    })
    store.get_list()
}
</script>

<template>
    <div class="main-home">
        <div class="mian-right">
            <div class="from-top">
                <div class="from-list">
                    <div class="from-input">
                        <el-select class="from-select" v-model="selectValue" filterable placeholder="请选择你需要的项">
                            <el-option
                                v-for="item in selectList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value"
                            />
                        </el-select>
                        <el-input clearable class="from-input-val" v-model="searchValue" placeholder="请输入搜索关键字" />
                        <el-button @click="store.search" type="primary">搜索</el-button>
                    </div>
                </div>
                <el-button-group class="ml-6">
                    <el-button @click="create" plain type="primary"><i class="iconfont icon-addNode"></i></el-button>
                    <el-button @click="batch_remove" plain type="warning"><i class="iconfont icon-piliangshanchu"></i></el-button>
                    <el-button @click="batch_down" plain type="success"><i class="iconfont icon-xiazai"></i></el-button>
                    <el-button @click="remove_all" plain type="danger"><i class="iconfont icon-quanbushanchu"></i></el-button>
                    <el-button @click="store.down_all" plain type="info"><i class="iconfont icon-daochu"></i></el-button>
                    <el-button @click="store.freshen" plain><i class="iconfont icon-shuaxin"></i></el-button>
                </el-button-group>
            </div>
            <el-table :data="roleList" @selection-change="handleSelectionChange" border style="width: 100%; height: 86%;">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" fixed sortable width="80" align="center" />
                <el-table-column prop="role_name" label="角色名称" align="center" width="150" />
                <el-table-column prop="intro" label="角色描述" align="center" />
                <el-table-column prop="is_state" label="状态" align="center">
                    <template #default="scope">
                        <el-popconfirm title="确定修改?" @confirm="store.state(scope.$index, scope.row)">
                            <template #reference>
                                <el-tag type="success" v-if="scope.row.is_state == 1">正常</el-tag>
                                <el-tag type="warning" v-else>禁用</el-tag>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="120" />
                <el-table-column prop="create_time" sortable label="创建时间" align="center" width="160"  />
                <el-table-column label="操作" width="130" fixed="right" align="center">
                    <template #default="scope">
                        <el-button v-if="scope.row.id != 1" circle size="small" @click="update(scope.$index, scope.row)">
                            <i class="iconfont icon-bianji"></i>
                        </el-button>
                        <el-button v-if="scope.row.id != 1" circle type="success" size="small" @click="auth(scope.$index, scope.row)">
                            <i class="iconfont icon-fuwushouquan"></i>
                        </el-button>
                        <el-button v-if="scope.row.id != 1" circle size="small" type="danger" @click="remove(scope.$index, scope.row)">
                            <i class="iconfont icon-shanchu"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                class="from-pagination"
                v-model:current-page="pagination.page"
                v-model:page-size="pagination.limit"
                :page-sizes="pagination.pageSize"
                :small="pagination.small"
                :layout="pagination.layout"
                :total="pagination.count"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
        <TableForm />
        <AuthFrom />
    </div>
</template>
