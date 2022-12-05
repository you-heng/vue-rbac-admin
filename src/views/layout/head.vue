<script setup>
import useStore from "@/store/modules/layout";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { layer } from "@layui/layer-vue";

const router = useRouter();
const store = useStore();
const { cutFoldOne, user } = storeToRefs(store);

const cutCollapse = () => {
  store.$patch({
    isCollapse: !store.isCollapse,
    layoutSide: store.isCollapse ? "layout-side" : "layout-side-collapse",
    cutFoldOne: store.isCollapse ? "icon-shouqi" : "icon-zhankai",
  });
};

const screen = () => {
  console.log(12234);
};

const refresh = () => {
  store.freshen()
}

const logout = () => {
  layer.confirm('确定要退出吗?', {
      title: '提示',
      btn: [
        {text: '取消', callback: function(id){ layer.close(id) }},
        {text: '确定', callback: function(id){
          store.submit_logout(router, id)
        }}
      ]
  })
};
</script>

<template>
  <div class="head-list">
    <i class="iconfont" :class="cutFoldOne" @click="cutCollapse"></i>
    <div class="head-list-right">
      <i class="iconfont icon-shuaxin" @click="refresh"></i>
      <i class="iconfont icon-fullscreen-expand" @click="screen"></i>
      <span class="head-list-span" @click="logout">
        <img class="head-list-img" :src="user.avatar" />
        <span>{{user.username}}</span>
      </span>
    </div>
  </div>
</template>
