import { set_title, get_item } from "./index";
import router from "@/router";

//白名单列表
const whiteList = ["/login"];

router.beforeEach((to, from, next) => {
    set_title(to.meta.title);
    if (!get_item("token")) {
        if (whiteList.indexOf(to.path) !== -1) {
            next();
        } else {
            next("/login");
        }
    } else {
        if (to.path === "/login") {
            next("/");
        }else{
            next();
        }
    }
});
