import { setting, get_item } from "@/utils";
import { ElLoading, ElMessage } from "element-plus";
import { layer } from "@layui/layer-vue";

//设置标题
const set_title = (title) => {
    let config = get_item('config') || setting
    document.title = title + " - " + config.sys_title;
};

//设置icon
const change_favicon = () => {
    let favicon = document.querySelector('link[rel="icon"]');
    let config = get_item('config') || setting
    let icon = config.sys_logo
    if (favicon !== null) {
        favicon.href = icon;
    } else {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.href = icon;
        document.head.appendChild(favicon);
    }
};

//loading
const loading = (fullscreenLoading = false) => {
    const load = ElLoading.service({
        lock: true,
        text: "Loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    if (fullscreenLoading) {
        load.close();
    }
};

//element弹窗
const message = (type, msg) => {
    ElMessage({
        type: type,
        message: msg,
        showClose: true,
    });
};

//验证
const verify = (data, fields) => {
    for (var i in fields) {
        if (!data[i] && i != "id") {
            layer.msg(fields[i], { time: 1000, icon: 3 })
            return false;
        }
    }
    return true;
}

//树形结构
const tree_data = (data, pid) => {
    data = Object.values(data)
    const result = []
    let temp;
    for(let i = 0; i < data.length; i++){
        if(data[i].pid === pid){
            temp = tree_data(data, data[i].id)
            if(temp.length > 0){
                data[i].children = temp
            }
            result.push(data[i])
        }
    }
    return result;
}

// 清除项目的所有项
const remove_field = (data) => {
    Object.keys(data).forEach((key) => {
        delete data[key]
    })
    return data
}

//更新字段
const obj_update = (data, obj, field) => {
    try {
      data.forEach((node) => {
        if (node.id === obj.id) {
          for (let i in field) {
            node[i] = obj[i];
          }
        }
      });
    } catch (e) {}
    return data;
  };

export {
    set_title,
    change_favicon,
    loading,
    message,
    verify,
    tree_data,
    remove_field,
    obj_update
}