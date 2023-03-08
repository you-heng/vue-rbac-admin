import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, obj_update } from "@/utils"

const roleStore = defineStore("roleStore", {
  state: () => {
    return {
        searchValue: '',
        selectValue: 'role_name',
        selectList: [
            {
                id: 1,
                value: 'ID',
                label: 'ID'
            },
            {
                id: 2,
                value: 'role_name',
                label: '角色名称'
            }
        ],
        roleList: [],
        authList: [],
        pagination: {
            limit: 10,
            page: 1,
            count: 3,
            pageSize: [100, 200, 300, 400],
            small: true,
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        ids: [],
        role_id: 0,
        data: {
            sort: 0
        },
        fields: {
            role_name: '请填写角色名称',
            intro: '请填写角色描述'
        },
        dialog: {
            dialogVisible: false,
            authDialogVisible: false,
            title: '添加'
        },
        lattice: {
            value: "id",
            label: "title",
            children: "children",
        },
        auths: {
            menu_ids: [],
            auth_ids: []
        }
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/role/index',
            params: {
                page: this.pagination.page,
                limit: this.pagination.limit
            }
        }).then((res) => {
            this.roleList = res.data
            this.pagination.page = res.page,
            this.pagination.limit = res.limit
            this.pagination.count = res.count
        })
    },
    // 获取权限列表
    auth_list(){
        http({
            method: 'get',
            url: 'console/auth/index',
            params: {}
        }).then((res) => {
            this.authList = res.data
        })
    },
    // 授权
    auth(){
        http({
            method: 'post',
            url: 'console/role/auth',
            data: {auths: this.auths, id: this.role_id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.dialog.authDialogVisible = false
            }
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/role/create',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.get_list()
                this.dialog.dialogVisible = false
            }
        })
    },
    // 状态
    state(index, row){
        http({
            method: 'post',
            url: 'console/role/is_state',
            data: {id: row.id, is_state: row.is_state}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.roleList[index].is_state = this.roleList[index].is_state == 1 ? 2 : 1
            }
        })
    },
    // 编辑
    update(){
        http({
            method: 'post',
            url: 'console/role/update',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.roleList = obj_update(this.roleList, this.data, this.fields)
                this.dialog.dialogVisible = false
            }
        })
    },
    // 删除
    remove(index, row, id){
        http({
            method: 'post',
            url: 'console/role/remove',
            data: {id: row.id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.roleList.splice(index, 1)
                layer.close(id)
            }
        })
    },
    // 搜索
    search(){
        if(this.searchValue.trim() === ''){
            layer.msg('请输入需要搜索的关键字')
            return false
        }
        http({
            method: 'post',
            url: 'console/role/search',
            data: {
                select: this.selectValue,
                search: this.searchValue
            }
        }).then((res) => {
            if(res.code === 200){
                this.roleList = res.data
            }
        })
    },
    // 刷新
    freshen(){
        this.get_list()
    },
    // 批量删除
    batch_remove(id){
        if(this.ids.length === 0){
            layer.msg('请选择需要删除的项目')
            return false
        }
        http({
            method: 'post',
            url: 'console/role/batch_remove',
            data: {ids: this.ids }
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.ids.forEach((item) => {
                    this.roleList = this.roleList.filter(key => key.id != item)
                })
            } 
        })
    },
    // 全部删除
    remove_all(id){
        http({
            method: 'post',
            url: 'console/role/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            let single = this.roleList[0];
            this.roleList = [];
            this.roleList.push(single)
        })
    },
    // 批量导出
    batch_down(){
        if(this.ids.length === 0){
            layer.msg('请选择需要导出的项目')
            return false
        }
        console.log('批量导出')
        // console/role/batch_down
    },
    // 全部导出
    down_all(){
        console.log('全部导出')
        // console/role/down_all
    }
  },
});

export default roleStore;
