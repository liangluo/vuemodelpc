
# 开发说明
```
请大家在开发过程中严格编码习惯，写好备注说明，开发过程中，规则请填写到下面项目说明中；
```
# 项目说明
```

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