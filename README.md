# RBAC-ADMIN权限管理系统

基于Vue3.0+Element-Plus完成的权限管理系统

- [gitee](https://gitee.com/An_mixiu/vue-rbac-admin)

- [后端(接口)](https://github.com/you-heng/rbac-admin)

- [gitee后端(接口)](https://gitee.com/An_mixiu/rbac-admin)

- [演示站](http://vue.anmixiu.com/rbac)

账号：demo

密码：123456

## nginx配置

在配置中增加以下内容，可以配置多个项目在同一个目录下

```
location /xx {
    # root 和 alias只需要一个就可以
    # 使用root配置
    root /www/wwwroot/xx.xx.com;        # 域名根目录
    # 使用alias配置
    alias /www/wwwroot/xx.xx.com/xx;    # 项目所在目录
    
    index index.html;
    try_files $uri $uri/ /xx/index.html;
}

location /aa {
    # root 和 alias只需要一个就可以
    # 使用root配置
    root /www/wwwroot/xx.xx.com;        # 域名根目录
    # 使用alias配置
    alias /www/wwwroot/xx.xx.com/aa;    # 项目所在目录
    
    index index.html;
    try_files $uri $uri/ /aa/index.html;
}

location /api {
    rewrite ^/api?(.*)$ $1 break;
    proxy_pass http://xx.xx.com/; # 接口
}
```