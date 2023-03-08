import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, obj_update } from "@/utils"

const adminStore = defineStore("adminStore", {
  state: () => {
    return {
        searchValue: '',
        selectValue: 'username',
        selectList: [
            {
                id: 1,
                value: 'ID',
                label: 'ID'
            },
            {
                id: 2,
                value: 'username',
                label: '用户名'
            },
            {
                id: 3,
                value: 'phone',
                label: '手机号'
            }
        ],
        adminList: [],
        teamList: [],
        jobList: [],
        roleList: [],
        pagination: {
            limit: 10,
            page: 1,
            count: 0,
            pageSize: [100, 200, 300, 400],
            small: true,
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        ids: [],
        id: 0,
        data: {
            sort: 0
        },
        fields: {
            username: '请填写用户名',
            role_ids: '请选择至少一个角色',
            team_ids: '请选择用户所属部门',
            job_id: '请选择一个职位',
            sort: 0
        },
        dialog: {
            dialogVisible: false,
            title: '添加'
        },
        lattice: {
            value: "id",
            label: "team_name",
            children: "children",
            checkStrictly: true,
        },
        jobLattice: {
            value: "id",    
            label: "job_name"
        },
        team_id: {}
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/admin/index',
            params: {
                page: this.pagination.page,
                limit: this.pagination.limit
            }
        }).then((res) => {
            this.adminList = res.data
            this.pagination.page = res.page,
            this.pagination.limit = res.limit
            this.pagination.count = res.count
        })
    },
    // 根据部门获取列表
    get_list_team(){
        http({
            method: 'post',
            url: 'console/admin/team',
            data: {team_id: this.team_id}
        }).then((res) => {
            this.adminList = res.data
        })
    },
    // 部门列表
    get_team_list(){
        http({
            method: 'post',
            url: 'console/team/index',
            params: {}
        }).then((res) => {
            this.teamList = res.data
        })
    },
    // 获取职位列表
    get_job_list(){
        http({
            method: 'get',
            url: 'console/admin/job',
            params: {}
        }).then((res) => {
            this.jobList = res.data
        })
    },
    // 获取角色列表
    get_role_list(){
        http({
            method: 'get',
            url: 'console/admin/role',
            params: {}
        }).then((res) => {
            this.roleList = res.data
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/admin/create',
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
            url: 'console/admin/is_state',
            data: {id: row.id, is_state: row.is_state}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.adminList[index].is_state = this.adminList[index].is_state == 1 ? 2 : 1
            }
        })
    },
    // 编辑
    update(){
        http({
            method: 'post',
            url: 'console/admin/update',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.dialog.dialogVisible = false
                this.adminList = obj_update(this.adminList, this.data, this.fields)
            }
        })
    },
    // 删除
    remove(index, row, id){
        http({
            method: 'post',
            url: 'console/admin/remove',
            data: {id: row.id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.adminList.splice(index, 1)
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
            url: 'console/admin/search',
            data: {
                select: this.selectValue,
                search: this.searchValue
            }
        }).then((res) => {
            if(res.code === 200){
                this.adminList = res.data
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
            url: 'console/admin/batch_remove',
            data: {ids: this.ids }
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.ids.forEach((item) => {
                    this.adminList = this.adminList.filter(key => key.id != item)
                })
            } 
        })
    },
    // 全部删除
    remove_all(id){
        http({
            method: 'post',
            url: 'console/admin/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            let single = this.adminList[0];
            this.adminList = [];
            this.adminList.push(single)
        })
    },
    // 批量导出
    batch_down(){
        if(this.ids.length === 0){
            layer.msg('请选择需要导出的项目')
            return false
        }
        // console/admin/batch_down
        console.log('批量导出')
    },
    // 全部导出
    down_all(){
        console.log('全部导出')
        // console/admin/down_all
    }
  },
});

export default adminStore;
