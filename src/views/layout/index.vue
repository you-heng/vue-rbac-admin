<script setup>
import Head from "./head.vue";
import Side from "./side.vue";
import useStore from "@/store/modules/layout";
import { storeToRefs } from "pinia";

const store = useStore();
const { layoutSide } = storeToRefs(store);
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside :class="layoutSide">
        <Side />
      </el-aside>
      <el-container>
        <el-header class="layout-head">
          <Head />
        </el-header>
        <el-main class="layout-main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
