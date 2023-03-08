import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, obj_update } from "@/utils"

const jobStore = defineStore("jobStore", {
  state: () => {
    return {
        searchValue: '',
        selectValue: 'job_name',
        selectList: [
            {
                id: 1,
                value: 'ID',
                label: 'ID'
            },
            {
                id: 2,
                value: 'job_name',
                label: '职位名称'
            }
        ],
        jobList: [],
        pagination: {
            limit: 10,
            page: 1,
            count: 3,
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
            job_name: '请填写职位名称',
            sort: 0
        },
        dialog: {
            dialogVisible: false,
            title: '添加'
        }
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/job/index',
            params: {
                page: this.pagination.page,
                limit: this.pagination.limit
            }
        }).then((res) => {
            this.jobList = res.data
            this.pagination.page = res.page,
            this.pagination.limit = res.limit
            this.pagination.count = res.count
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/job/create',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.get_list()
                this.dialog.dialogVisible = false
            }
        })
    },
    // 编辑
    update(){
        http({
            method: 'post',
            url: 'console/job/update',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.jobList = obj_update(this.jobList, this.data, this.fields)
                this.dialog.dialogVisible = false
            }
        })
    },
    // 删除
    remove(index, id, row){
        http({
            method: 'post',
            url: 'console/job/remove',
            data: {id: id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.jobList.splice(index, 1)
                layer.close(row)
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
            url: 'console/job/search',
            data: {
                select: this.selectValue,
                search: this.searchValue
            }
        }).then((res) => {
            if(res.code === 200){
                this.jobList = res.data
            }
        })
    },
    // 状态
    state(index, row){
        http({
            method: 'post',
            url: 'console/job/is_state',
            data: {id: row.id, is_state: row.is_state}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.jobList[index].is_state = this.jobList[index].is_state == 1 ? 2 : 1
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
            url: 'console/job/batch_remove',
            data: {ids: this.ids }
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.ids.forEach((item) => {
                    this.jobList = this.jobList.filter(key => key.id != item)
                })
            } 
        })
    },
    // 全部删除
    remove_all(id){
        http({
            method: 'post',
            url: 'console/job/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            this.jobList = []
        })
    },
    // 批量导出
    batch_down(){
        if(this.ids.length === 0){
            layer.msg('请选择需要导出的项目')
            return false
        }
        http({
            method: 'post',
            url: 'console/job/batch_down',
            data: {ids: this.ids }
        }).then((res) => {
            // layer.msg(res.msg)
        })
    },
    // 全部导出
    down_all(){
        console.log('全部导出')
        //console/job/down_all
    }
  },
});

export default jobStore;