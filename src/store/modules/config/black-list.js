import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, obj_update, download_execl } from "@/utils"

const blackListStore = defineStore("blackListStore", {
    state: () => {
        return {
            searchValue: '',
            selectValue: 'ip',
            selectList: [
                {
                    id: 1,
                    value: 'id',
                    label: 'ID'
                },
                {
                    id: 2,
                    value: 'ip',
                    label: 'ip地址'
                }
            ],
            blackLists: [],
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
                ip: '请填写ip地址',
                is_type: '请选择类型'
            },
            dialog: {
                dialogVisible: false,
                title: '添加'
            }
        }
    },
    actions: {
        // 列表
        get_list(){
            http({
                method: 'get',
                url: 'console/BlackList/index',
                params: {
                    page: this.pagination.page,
                    limit: this.pagination.limit
                }
            }).then((res) => {
                this.blackLists = res.data.data
                this.pagination.page = res.data.current_page
                this.pagination.limit = res.data.per_page
                this.pagination.count = res.data.total
            })
        },
        // 增加
        create(){
            http({
                method: 'post',
                url: 'console/BlackList/create',
                data: {...this.data}
            }).then((res) => {
                layer.msg(res.msg)
                if(res.code === 200){
                    this.get_list()
                    this.dialog.dialogVisible = false
                }
            })
        },
        // 修改
        update(){
            http({
                method: 'post',
                url: 'console/BlackList/update',
                data: {...this.data}
            }).then((res) => {
                layer.msg(res.msg)
                if(res.code === 200){
                    this.blackLists = obj_update(this.blackLists, this.data, this.fields)
                    this.dialog.dialogVisible = false
                }
            })
        },
        // 状态
        state(index, id, is_state){
            http({
                method: 'post',
                url: 'console/BlackList/is_state',
                data: {
                    id: id,
                    is_state: is_state
                }
            }).then((res) => {
                layer.msg(res.msg)
                if(res.code === 200){
                    this.blackLists[index].is_state = this.blackLists[index].is_state == 1 ? 2 : 1
                }
            })
        },
        // 删除
        remove(index, id, row){
            http({
                method: 'post',
                url: 'console/BlackList/remove',
                data: {id: id}
            }).then((res) => {
                layer.msg(res.msg)
                if(res.code === 200){
                    this.blackLists.splice(index, 1)
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
                url: 'console/BlackList/search',
                data: {
                    select: this.selectValue,
                    search: this.searchValue
                }
            }).then((res) => {
                if(res.code === 200){
                    this.blackLists = res.data
                }
            })
        },
        // 批量删除
        batch_remove(id){
            if(this.ids.length === 0){
                layer.msg('请选择需要删除的项目')
                return false
            }
            http({
                method: 'post',
                url: 'console/BlackList/batch_remove',
                data: {ids: this.ids }
            }).then((res) => {
                layer.close(id)
                layer.msg(res.msg)
                if(res.code === 200){
                    this.ids.forEach((item) => {
                        this.blackLists = this.blackLists.filter(key => key.id != item)
                    })
                } 
            })
        },
        // 清空
        remove_all(){
            http({
                method: 'post',
                url: 'console/BlackList/remove_all',
                data: {}
            }).then((res) => {
                layer.close(id)
                layer.msg(res.msg)
                this.blackLists = []
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
                url: 'console/BlackList/batch_down',
                data: {ids: this.ids},
                responseType: 'blob', // 设置响应数据类型
            }).then((data) => {
                download_execl(data, 'IP防火墙列表.xlsx')
                layer.msg('下载成功')
            })
        },
        // 全部导出
        down_all(){
            http({
                method: 'post',
                url: 'console/BlackList/down_all',
                data: {},
                responseType: 'blob', // 设置响应数据类型
            }).then((data) => {
                download_execl(data, 'IP防火墙列表.xlsx')
                layer.msg('下载成功')
            })
        }
    }
});

export default blackListStore;