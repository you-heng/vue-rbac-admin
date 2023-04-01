<script setup>
import useStore from "@/store/modules/system/admin"
import { layer } from "@layui/layer-vue";
import { storeToRefs } from "pinia";
import TableForm from "./components/admin-from.vue";
import { remove_field } from "@/utils"
import { ref } from "vue";

const store = useStore()
const { adminList, teamList, selectValue, selectList, pagination, searchValue, ids, data } = storeToRefs(store)

store.get_list()
store.get_team_list()

const visible = ref({
    create: false,
    batch_remove: false,
    batch_down: false,
    remove_all: false,
    down_all: false,
    freshen: false,
})

// 新增
const create = () => {
    store.get_job_list()
    store.get_role_list()
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
    store.get_job_list()
    store.get_role_list()
    store.$patch({
        dialog: {
            dialogVisible: true,
            title: '编辑'
        },
        data: {...row}
    })
}

// 删除
const remove = (index, row) => {
    layer.confirm('确定要删除吗?', {
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

// 根据部门筛选用户
const handleClick = (row) => {
    store.$patch({
        team_id: row.id
    })
    store.get_list_team()
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
    <div class="main-home admin-home">
        <div class="admin-left">
            <el-table
                :data="teamList"
                style="width: 100%; margin-bottom: 20px"
                row-key="id"
                @row-click="handleClick"
                >
                <el-table-column prop="team_name" label="部门架构"/>
            </el-table>
        </div>
        <div class="admin-right">
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
                    <lay-tooltip :visible="visible.create" trigger="click" content="添加" >
                        <el-button @mouseenter="visible.create=true" @mouseleave="visible.create=false" @click="create" plain type="primary"><i class="iconfont icon-addNode"></i></el-button>
                    </lay-tooltip>
                    <lay-tooltip :visible="visible.batch_remove" trigger="click" content="批量删除" >
                        <el-button @mouseenter="visible.batch_remove=true" @mouseleave="visible.batch_remove=false" @click="batch_remove" plain type="warning"><i class="iconfont icon-piliangshanchu"></i></el-button>
                    </lay-tooltip>
                    <lay-tooltip :visible="visible.batch_down" trigger="click" content="批量下载" >
                        <el-button @mouseenter="visible.batch_down=true" @mouseleave="visible.batch_down=false" @click="batch_down" plain type="success"><i class="iconfont icon-xiazai"></i></el-button>
                    </lay-tooltip>
                    <lay-tooltip :visible="visible.remove_all" trigger="click" content="清空" >
                        <el-button @mouseenter="visible.remove_all=true" @mouseleave="visible.remove_all=false" @click="remove_all" plain type="danger"><i class="iconfont icon-quanbushanchu"></i></el-button>
                    </lay-tooltip>
                    <lay-tooltip :visible="visible.down_all" trigger="click" content="导出全部" >
                        <el-button @mouseenter="visible.down_all=true" @mouseleave="visible.down_all=false" @click="store.down_all" plain type="info"><i class="iconfont icon-daochu"></i></el-button>
                    </lay-tooltip>
                    <lay-tooltip :visible="visible.freshen" trigger="click" content="刷新" >
                        <el-button @mouseenter="visible.freshen=true" @mouseleave="visible.freshen=false" @click="store.freshen" plain><i class="iconfont icon-shuaxin"></i></el-button>
                    </lay-tooltip>
                </el-button-group>
            </div>
            <el-table :data="adminList" @selection-change="handleSelectionChange" border style="width: 100%; height: 86%;">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" fixed sortable width="80" align="center" />
                <el-table-column prop="username" label="用户名" width="100" align="center" />
                <el-table-column prop="phone" label="手机号码" align="center" width="130" />
                <el-table-column prop="email" label="邮箱" align="center" width="150" />
                <el-table-column prop="role_name" label="角色" align="center" width="180"  />
                <el-table-column prop="team_name" label="部门" align="center" width="180"  />
                <el-table-column prop="job_name" label="岗位" align="center" width="130" />
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
                <el-table-column prop="sort" label="排序" align="center" />
                <el-table-column prop="create_time" sortable label="创建时间" align="center" width="160"  />
                <el-table-column label="操作" width="90" fixed="right" align="center">
                    <template #default="scope">
                        <template v-if="scope.row.id != 1">
                            <el-button circle size="small" @click="update(scope.$index, scope.row)">
                                <i class="iconfont icon-bianji"></i>
                            </el-button>
                            <el-button circle size="small" type="danger" @click="remove(scope.$index, scope.row)">
                                <i class="iconfont icon-shanchu"></i>
                            </el-button>
                        </template>
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

<style lang="scss" scoped>
    .main-home{
        padding: 0;
        width: 100%;
        height: 100%;
        font-size: var(--el-font-size-base);
    }
    .admin-home{
        background-color: #f5f5f5 !important;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .admin-left{
            padding: 1rem;
            width: calc(30% - 2rem);
            background-color: #fff;
        }
        .admin-right{
            padding: 1rem;
            width: calc(68% - 2rem);
            background-color: #fff;
        }
    }
</style>