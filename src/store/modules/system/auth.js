import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, download_execl } from "@/utils"

const authStore = defineStore("authStore", {
  state: () => {
    return {
        authList: [],
        auths: [],
        topLevel: {
            id: 0,
            title: '顶级权限',
            pid: 0
        },
        data: {
            sort: 0
        },
        fields: {
            title: '请填写权限名',
            path: '请填写地址',
            p_ids: '请选择父级权限',
            is_menu: '请选择类型'
        },
        dialog: {
            dialogVisible: false,
            title: '添加'
        },
        lattice: {
            value: "id",
            label: "title",
            children: "children",
            checkStrictly: true,
        }
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/auth/index',
            params: {}
        }).then((res) => {
            this.update_list(res.data)
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/auth/create',
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
            url: 'console/auth/update',
            data: {...this.data}
        }).then((res) => {
            layer.msg(res.msg)
            if(res.code === 200){
                this.get_list()
                this.dialog.dialogVisible = false
            }
        })
    },
    // 删除
    remove(index, id, row){
        http({
            method: 'post',
            url: 'console/auth/remove',
            data: {id: id.id}
        }).then((res) => {
            layer.msg(res.msg)
            this.get_list()
            if(res.code === 200){
                layer.close(row)
            }
        })
    },
    // 刷新
    freshen(){
        this.get_list()
    },
    // 全部删除
    remove_all(id){
        http({
            method: 'post',
            url: 'console/auth/remove_all',
            data: {}
        }).then((res) => {
            layer.close(id)
            layer.msg(res.msg)
            if(res.code === 200){
                this.update_list(res.data)
            }
        })
    },
    update_list(data){
        this.authList = data
        this.auths = [{...this.topLevel}]
        this.auths.push(...data)
    },
    // 全部导出
    down_all(){
        http({
            method: 'post',
            url: 'console/auth/down_all',
            data: {},
            responseType: 'blob', // 设置响应数据类型
        }).then((data) => {
            download_execl(data, '权限列表.xlsx')
            layer.msg('下载成功')
        })
    }
  },
});

export default authStore;
