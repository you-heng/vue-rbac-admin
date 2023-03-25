import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http } from "@/utils"

const interfaceLogsStore = defineStore("interfaceLogsStore", {
  state: () => {
    return {
        searchValue: '',
        selectValue: 'username',
        selectList: [
            {
                id: 1,
                value: 'id',
                label: 'ID'
            },
            {
                id: 2,
                value: 'username',
                label: '操作用户'
            }
        ],
        logsList: [],
        pagination: {
            limit: 10,
            page: 1,
            count: 0,
            pageSize: [100, 200, 300, 400],
            small: true,
            layout: 'total, sizes, prev, pager, next, jumper'
        },
        ids: []
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/InterfaceLogs/index',
            params: {
                page: this.pagination.page,
                limit: this.pagination.limit
            }
        }).then((res) => {
            this.logsList = res.data.data
            this.pagination.page = res.data.current_page
            this.pagination.limit = res.data.per_page
            this.pagination.count = res.data.total
        })
    },
    // 删除
    remove(index, row, id){
        http({
            method: 'post',
            url: 'console/InterfaceLogs/remove',
            data: {id: row.id}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.logsList.splice(index, 1)
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
            url: 'console/InterfaceLogs/search',
            data: {
                select: this.selectValue,
                search: this.searchValue
            }
        }).then((res) => {
            if(res.code === 200){
                this.logsList = res.data
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
            url: 'console/InterfaceLogs/batch_remove',
            data: {ids: this.ids }
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.ids.forEach((item) => {
                    this.logsList = this.logsList.filter(key => key.id != item)
                })
            } 
        })
    },
    // 全部删除
    remove_all(){
        http({
            method: 'post',
            url: 'console/InterfaceLogs/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            this.logsList = []
        })
    },
    // 批量导出
    batch_down(){
        if(this.ids.length === 0){
            layer.msg('请选择需要导出的项目')
            return false
        }
        console.log('批量导出')
        //console/InterfaceLogs/batch_down
    },
    // 全部导出
    down_all(){
        console.log('全部导出')
        //console/InterfaceLogs/down_all
    }
  },
});

export default interfaceLogsStore;
