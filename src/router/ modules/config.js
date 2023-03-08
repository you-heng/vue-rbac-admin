const system = [
    {
      path: "/config",
      name: "config",
      meta: {
        title: "系统管理",
        icon: "el-icon-menu",
      },
      children: [
        {
          path: "/config/dict",
          name: "dict",
          meta: {
            title: "字典管理",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/config/dict.vue"),
        },
        {
          path: "/config/black-list",
          name: "black-list",
          meta: {
            title: "ip黑名单",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/config/black-list.vue"),
        },
        {
          path: "/config/interface-logs",
          name: "interface-logs",
          meta: {
            title: "日志管理",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/config/interface-logs.vue"),
        }
      ],
    },
  ];
  
  export default system;