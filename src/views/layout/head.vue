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

const userinfo = () => {
  router.push('/userinfo')
}
</script>

<template>
  <div class="head-list">
    <i class="iconfont" :class="cutFoldOne" @click="cutCollapse"></i>
    <div class="head-list-right">
      <i class="iconfont icon-shuaxin" @click="refresh"></i>
      <i class="iconfont icon-fullscreen-expand" @click="screen"></i>
      <el-tooltip placement="bottom" effect="light">
        <template #content>
          <div class="head-list-avatar">
            <span class="head-list-avatar-span" @click="userinfo">个人信息</span>
            <span class="head-list-avatar-span" @click="logout">退出系统</span>
          </div>
        </template>
        <span class="head-list-span">
          <img class="head-list-img" :src="user.avatar.url" />
          <span>{{user.username}}</span>
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.head-list-avatar{
  display: flex;
  flex-direction: column;
  .head-list-avatar-span{
    padding: 0 0.5rem;
    height: 3.5rem;
    line-height: 3.5rem;
    cursor: pointer;
  }
}
</style>