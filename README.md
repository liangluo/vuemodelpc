# vuemodelpc
vue PC端管理门户初始模版

## Project introduce
```
1.项目为PC端管理后台基础框架，包含了以下功能
   1.1. 公共基础样式：common.scss

   1.2. 封装axios
      1.2.1. 利用html5缓存来缓存请求，设置outTime为0时不重新请求；
      1.2.2. 接口权限控制，请求头带上token验证；

   1.3. 封装缓存storage.js

   1.4. 默认安装element-ui的组件库，根据项目情况，自行调整UI库
      1.4.1. 按需引入Element组件，减少冗余
      1.4.2. 主题样式引入element-theme主题
            1.4.2.1  如安装报错，可使用sudo npm install -g element-theme --unsafe-perm=true --allow-root

          

   1.5. 封装路由:router/index.js
      1.5.1 单独配置路由表staticRouter，避免路由庞大，混淆；
      1.5.2 设置白名单whiteList，让不需要登录的页面可以直接访问，没有限制

   1.6.使用.env相关文件配置环境变量（开发环境，生产环境）

   1.7.使用mockjs来拦截请求，生成模拟数据并返回给前端页面。
      1.7.1.在本地环境使用mockjs来模拟请求数据

   1.8.使用cryptojs加密算法，登录加密；

   1.9.权限控制
      1.9.1 页面权限 （采用接口返回用户权限，前端相应的显示权限菜单）
      1.9.2 指令权限  (配置某个页面的修改，删除功能权限)
      1.9.3 用户 / 角色 / 页面权限 页面

   1.10.包含了登录和注册功能login；
      1.10.1. 登录 / 注册 / 注销 
      1.10.2. 修改密码

   1.11.包含403，404，500错误页面error

   1.12.包含了页面布局layout
      1.12.1. 上/左/右结构
      1.12.2. 侧边栏无限菜单，以及可以收缩功能

   1.13.其他组件库方案
      1.13.1 加载进度条NProgress;
      1.13.2 图表库v-echart，可按需引入相应的图表;
      1.13.3 富文本编辑器quillEditor
      1.13.4 拖拽工具vuedraggable
    

```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
