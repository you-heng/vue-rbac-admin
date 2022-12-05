import { defineStore } from "pinia";
import { get_item, clear_storage, http } from "@/utils";
import { layer } from "@layui/layer-vue"

const layoutStore = defineStore("layoutStore", {
  state: () => {
    return {
      isCollapse: false,
      defaultActive: get_item("defaultActive") || "",
      defaultOpeneds: get_item("defaultOpeneds") || [],
      layoutSide: "layout-side",
      cutFoldOne: "icon-shouqi",
      menuList: [],
      desk: {
        icon: 'icon-menu_kongzhitai',
        is_show: false,
        name: '控制台',
        path: '/console',
        pid: 0
      },
      token: get_item('token') || "",
      user: get_item('user')
    };
  },
  actions: {
    //获取菜单
    get_menu() {
      http({
        method: 'get',
        url: 'console/auth/menu',
        data: {}
      }).then((res) => {
        if(res.code === 200){
          this.menuList = []
          this.menuList.push(this.desk)
          this.menuList.push(...res.data)
        }
      })
    },
    //刷新
    freshen(){
      this.get_menu()
    },
    //退出登录
    submit_logout(router, id){
      http({
          method: 'get',
          url: 'console/index/logout',
          params: {}
      }).then((res) => {
          layer.msg(res.msg)
          layer.close(id)
          clear_storage()
          setTimeout(() => {
              router.push('/login')
          }, 500)
      })
  }
  },
});

export default layoutStore;
