<script setup>
import Menu from "./menu.vue"
import useStore from "@/store/modules/layout"
import { storeToRefs } from "pinia"
import { set_item } from "@/utils"

const store = useStore()
const { isCollapse, defaultActive, defaultOpeneds, menuList } = storeToRefs(store)

store.get_menu()

const handleOpen = (key, keyPath) => {
    store.$patch({
        defaultOpeneds: keyPath
    })
    set_item("defaultOpeneds", keyPath)
}
</script>

<template>
    <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo" text-color="#fff"
        :collapse="isCollapse" :default-active="defaultActive" :default-openeds="defaultOpeneds" @open="handleOpen"
        :collapse-transition="false" unique-opened router>
        <Menu :menu="menuList" />
    </el-menu>
</template>