import { defineStore } from "pinia";
import { layer } from "@layui/layer-vue";
import { http, download_execl } from "@/utils"

const teamStore = defineStore("teamStore", {
  state: () => {
    return {
        teamList: [],
        teams: [],
        topLevel: {
            id: 0,
            team_name: '顶级部门',
            pid: 0
        },
        data: {
            sort: 0
        },
        fields: {
            team_name: '请填部门名称',
            p_ids: '请选择所属父级'
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
        }
    };
  },
  actions: {
    // 获取列表
    get_list(){
        http({
            method: 'get',
            url: 'console/team/index',
            params: {}
        }).then((res) => {
            this.update_list(res.data)
        })
    },
    // 新增
    create(){
        http({
            method: 'post',
            url: 'console/team/create',
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
            url: 'console/team/update',
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
                //this.teamList[index].is_state = this.teamList[index].is_state == 1 ? 2 : 1
            }
        })
    },
    // 删除
    remove(index, id, row){
        http({
            method: 'post',
            url: 'console/team/remove',
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
            url: 'console/team/remove_all',
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
        this.teamList = data
        this.teams = [{...this.topLevel}]
        this.teams.push(...data)
    },
    // 全部导出
    down_all(){
        http({
            method: 'post',
            url: 'console/team/down_all',
            data: {},
            responseType: 'blob', // 设置响应数据类型
        }).then((data) => {
            download_execl(data, '团队列表.xlsx')
            layer.msg('下载成功')
        })
    }
  },
});

export default teamStore;
