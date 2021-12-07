
# 开发说明
```
请大家在开发过程中严格编码习惯，写好备注说明，开发过程中，规则请填写到下面项目说明中；
```
# 项目说明
```
1.项目为PC端管理后台基础框架，包含以下功能:
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
1.7.权限控制
    1.7.1 页面权限 （采用接口返回用户权限，前端相应的显示权限菜单）
1.8.包含403，404，500错误页面error
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

#### 启动报 address already in use :::8989 at Server解决方法
修改文件在 node_modules/page-skeleton-webpack-plugin-master/src/skeletonPlugin.js 在 SkeletonPlugin.prototype.createServer 里加一个if判断
```
// const server = this.server = new Server(this.options) // eslint-disable-line no-multi-assign
// server.listen().catch(err => server.log.warn(err))
if (!this.server) {
const server = this.server = new Server(this.options) // eslint-disable-line no-multi-assign
server.listen().catch(err => server.log.warn(err))
}
```