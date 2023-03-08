<script setup>
import useStore from "@/store/modules/config/black-list"
import { storeToRefs } from "pinia";
import TableForm from "./components/black-list-from.vue";
import { layer } from "@layui/layer-vue";
import { remove_field } from "@/utils"

const store = useStore()
const { blackLists, selectValue, selectList, pagination, searchValue, ids, data } = storeToRefs(store)

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

//修改状态
const state = (index, row) => {
  store.state(index, row.id, row.is_state);
}

// 删除
const remove = (index, row) => {
    layer.confirm('确定要删除吗?', {
        title: '提示',
        btn: [
            {text: '取消', callback: function(id){ layer.close(id) }},
            {text: '确定', callback: function(id){
                store.remove(index, row.id, id)
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
            <el-table :data="blackLists" @selection-change="handleSelectionChange" border style="width: 100%; height: 86%;">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" fixed sortable width="80" align="center" />
                <el-table-column prop="ip" label="ip地址" align="center" />
                <el-table-column prop="is_type" label="类型" align="center" width="100">
                    <template #default="scope">
                        <el-tag type="success" v-if="scope.row.is_type == 1">永久拉黑</el-tag>
                        <el-tag type="warning" v-else>暂时拉黑</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="reason" label="冻结理由" align="center" />
                <el-table-column prop="time" label="截至时间" align="center" />
                <el-table-column prop="is_state" label="状态" align="center" width="80">
                    <template #default="scope">
                        <el-popconfirm title="确定修改?" @confirm="state(scope.$index, scope.row)">
                            <template #reference>
                                <el-tag type="success" v-if="scope.row.is_state == 1">正常</el-tag>
                                <el-tag type="warning" v-else>禁用</el-tag>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
                <el-table-column prop="sort" label="排序" align="center" width="100" />
                <el-table-column prop="create_time" sortable label="创建时间" align="center" width="160"  />
                <el-table-column label="操作" width="90" fixed="right" align="center">
                    <template #default="scope">
                        <el-button circle size="small" @click="update(scope.$index, scope.row)">
                            <i class="iconfont icon-bianji"></i>
                        </el-button>
                        <el-button circle size="small" type="danger" @click="remove(scope.$index, scope.row)">
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
    </div>
</template>