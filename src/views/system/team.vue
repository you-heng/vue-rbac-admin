<script setup>
import useStore from "@/store/modules/system/team"
import { storeToRefs } from "pinia";
import TableForm from "./components/team-from.vue";
import { layer } from "@layui/layer-vue";
import { remove_field } from "@/utils"
import { ref } from "vue";

const store = useStore()
const { teamList, data } = storeToRefs(store)

store.get_list()

const visible = ref({
    create: false,
    remove_all: false,
    down_all: false,
    freshen: false,
})

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
</script>

<template>
    <div class="main-home">
        <div class="mian-right">
            <div class="from-top">
                <div class="from-list"></div>
                <el-button-group class="ml-6">
                    <lay-tooltip :visible="visible.create" trigger="click" content="添加" >
                        <el-button @mouseenter="visible.create=true" @mouseleave="visible.create=false" @click="create" plain type="primary"><i class="iconfont icon-addNode"></i></el-button>
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
            <el-table :data="teamList" @selection-change="handleSelectionChange" border row-key="id" style="width: 100%; height: 86%;">
                <el-table-column type="selection" width="55" />
                <el-table-column prop="id" label="ID" fixed sortable width="80" align="center" />
                <el-table-column prop="team_name" label="部门名称" align="center" />
                <el-table-column prop="p_name" label="父级部门" align="center" />
                <el-table-column prop="is_state" label="状态" align="center">
                    <template #default="scope">
                        <el-popconfirm title="确定修改?" @confirm="state(scope.$index, scope.row)">
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
                        <el-button circle size="small" @click="update(scope.$index, scope.row)">
                            <i class="iconfont icon-bianji"></i>
                        </el-button>
                        <el-button circle size="small" type="danger" @click="store.remove(scope.$index, scope.row)">
                            <i class="iconfont icon-shanchu"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <TableForm />
    </div>
</template>