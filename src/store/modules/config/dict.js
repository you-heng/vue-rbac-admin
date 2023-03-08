import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, obj_update } from "@/utils"

const dictStore = defineStore("dictStore", {
  state: () => {
    return {
        searchValue: '',
        selectValue: 'key',
        selectList: [
            {
                id: 1,
                value: 'id',
                label: 'ID'
            },
            {
                id: 2,
                value: 'key',
                label: '配置名'
            },
            {
                id: 3,
                value: 'val',
                label: '配置值'
            },
            {
                id: 4,
                value: 'remark',
                label: '备注'
            }
        ],
        dictList: [],
        pagination: {
            limit: 10,
            page: 1,
            count: 0,
            pageSize: [100, 200, 300, 400],
            small: true,
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        ids: [],
        data: {
            sort: 0
        },
        fields: {
            key: '请填写配置名',
            val: '请填写配置值',
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
            url: 'console/dict/index',
            params: {
                page: this.pagination.page,
                limit: this.pagination.limit
            }
        }).then((res) => {
            this.dictList = res.data
            this.pagination.page = res.page,
            this.pagination.limit = res.limit
            this.pagination.count = res.count
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/dict/create',
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
            url: 'console/dict/update',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.dictList = obj_update(this.dictList, this.data, this.fields)
                this.dialog.dialogVisible = false
            }
        })
    },
    // 状态
    state(index, id, is_state){
        http({
            method: 'post',
            url: 'console/dict/is_state',
            data: {
                id: id,
                is_state: is_state
            }
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.dictList[index].is_state = this.dictList[index].is_state == 1 ? 2 : 1
            }
        })
    },
    // 删除
    remove(index, id, row){
        http({
            method: 'post',
            url: 'console/dict/remove',
            data: {id: id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.dictList.splice(index, 1)
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
            url: 'console/dict/search',
            data: {
                select: this.selectValue,
                search: this.searchValue
            }
        }).then((res) => {
            if(res.code === 200){
                this.dictList = res.data
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
            url: 'console/dict/batch_remove',
            data: {ids: this.ids }
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.ids.forEach((item) => {
                    this.dictList = this.dictList.filter(key => key.id != item)
                })
            } 
        })
    },
    // 清空
    remove_all(){
        http({
            method: 'post',
            url: 'console/dict/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            this.dictList = []
        })
    },
    // 批量导出
    batch_down(){
        if(this.ids.length === 0){
            layer.msg('请选择需要导出的项目')
            return false
        }
        console.log(this.ids)
        //console/dict/batch_down
    },
    // 全部导出
    down_all(){
        console.log('全部导出')
        //console/dict/down_all
    }
  },
});

export default dictStore;
