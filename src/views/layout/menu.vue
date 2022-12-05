<script setup>
import { set_item, loading } from "@/utils"
import useStore from "@/store/modules/layout"

const store = useStore()
const props = defineProps(['menu']);

const clickPath = (path) => {
    store.$patch({
        defaultActive: path
    })
    set_item("defaultActive", path)
}
</script>

<template>
    <template v-for="item in menu" :key="item.id">
        <el-sub-menu v-if="item.is_show === true" :index="item.path">
            <template #title>
                <i class="icon iconfont" :class="item.icon"></i>
                <span>{{item.name}}</span>
            </template>
            <Menu :menu="item.children"></Menu>
        </el-sub-menu>
        <el-menu-item v-else :index="item.path" @click="clickPath(item.path)">
            <i class="icon iconfont" :class="item.icon"></i>
            <template #title>{{item.name}}</template>
        </el-menu-item>
    </template>
</template>