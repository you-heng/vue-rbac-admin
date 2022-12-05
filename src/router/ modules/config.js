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
          path: "/config/logs",
          name: "logs",
          meta: {
            title: "登录日志",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/config/logs.vue"),
        }
      ],
    },
  ];
  
  export default system;