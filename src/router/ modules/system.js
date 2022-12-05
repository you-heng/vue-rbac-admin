const system = [
    {
      path: "/system",
      name: "system",
      meta: {
        title: "系统管理",
        icon: "el-icon-menu",
      },
      children: [
        {
          path: "/system/admin",
          name: "admin",
          meta: {
            title: "用户管理",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/system/admin.vue"),
        },
        {
          path: "/system/role",
          name: "role",
          meta: {
            title: "角色管理",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/system/role.vue"),
        },
        {
          path: "/system/auth",
          name: "auth",
          meta: {
            title: "权限管理",
            icon: "el-icon-menu",
          },
          component: () => import("@/views/system/auth.vue"),
        },
        {
            path: "/system/team",
            name: "team",
            meta: {
                title: "部门管理",
                icon: "el-icon-menu",
            },
            component: () => import("@/views/system/team.vue"),
        },
        {
            path: "/system/job",
            name: "job",
            meta: {
                title: "职位管理",
                icon: "el-icon-menu",
            },
            component: () => import("@/views/system/job.vue"),
        },
      ],
    },
  ];
  
  export default system;