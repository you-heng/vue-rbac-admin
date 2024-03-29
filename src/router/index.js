import { createRouter, createWebHistory } from "vue-router";
import system from "./ modules/system"
import config from "./ modules/config"

const routes = [
    {
        path: "/",
        name: "index",
        meta: {
            title: '首页'
        },
        component: () => import("@/views/layout/index.vue"),
        redirect: "/console",
        children: [
            {
                path: "/console",
                name: "console",
                meta: {
                    title: "工作台",
                    icon: ""
                },
                component: () => import("@/views/console.vue")
            },
            {
                path: "/userinfo",
                name: "userinfo",
                meta: {
                    title: "个人信息"
                },
                component: () => import("@/views/userinfo.vue")
            },
            ...system,
            ...config
        ]
    },
    {
        path: "/login",
        name: "login",
        meta: {
            title: "登录"
        },
        component: () => import("@/views/login.vue")
    },
    {
        path: "/:pathMatch(.*)*",
        name: "404",
        meta: {
            title: "404",
        },
        component: () => import("@/views/error/404.vue"),
    },
];

const router = createRouter({
    // history: createWebHistory('rbac'),
    history: createWebHistory(),
    routes
});

export default router