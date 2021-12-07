const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin');

function resolve (dir) {
  return path.join(__dirname, dir)
}

process.env.VUE_APP_VERSION = process.env.BUILD_NUMBER || '-'

module.exports = {
  outputDir: 'wgMgr', // build后文件目录
  filenameHashing: true, // 静态资源带hash
  lintOnSave: false, // 保存时是否用eslint-loader来lint代码
  runtimeCompiler: false, // 是否使用包含运行时编译的Vue内核版本，可以在vue中使用template,应用增加10Kb左右；
  transpileDependencies: [], // 通过 Babel 显式转译一个依赖，可以在这个选项中列出来
  productionSourceMap: false, // 设置为false,加速生产环境的构建；
  crossorigin: undefined, // 生成的 HTML 中 <link rel="stylesheet"> 和 <script> 标签的 crossorigin 属性
  integrity: false, // 启用该选项可以提供额外的安全性
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // 设置路径别名
      .set('@pages', resolve('src/views/pages')) // 设置路径别名
  },
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      return {
        plugins: [
          new CompressionPlugin({
            algorithm: 'gzip',
            test: /\.js$|\.html$|\.css$/,
            threshold: 1000,
            deleteOriginalAssets: false,
            minRatio: 0.8
          })
        ]
      };
    }
  },
  devServer: {
    open: true, // 自动打开浏览器配置
    host: 'localhost', // 启动地址
    port: 8080, // 端口
    https: false,
    hotOnly: true, // 热更新
    overlay: {
      warnings: false, // 不显示警告
      errors: false
    },
    proxy: (() => {
      // 代理转发
      const _basePath = process.env.VUE_APP_BASE_PATH.endsWith('/')
        ? process.env.VUE_APP_BASE_PATH
        : process.env.VUE_APP_BASE_PATH + '/'
      const _path = _basePath + 'api/'
      const result = {}
      result[_path] = {
        target: 'http://www.zxinhb.com',
        changeOrigin: true,
        pathRewrite: {}
      }
      result[_path].pathRewrite['^' + _path] = '/'
      return result
    })()
  },
  publicPath: process.env.NODE_ENV === 'production' ? '/wgMgr/' : '/'
}
