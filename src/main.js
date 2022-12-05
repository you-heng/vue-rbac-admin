import { createApp } from "vue";
import App from "@/App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import Layui from "@layui/layui-vue";
import "@layui/layui-vue/lib/index.css";
import store from "@/store";
import router from "@/router";
import "@/assets/css/index.scss";
import "@/assets/css/iconfont.css";
import "@/utils/auth"

const app = createApp(App);

app.use(Layui);
app.use(store);
app.use(router);
app.use(ElementPlus, {
  locale: zhCn,
});
app.mount("#app");
