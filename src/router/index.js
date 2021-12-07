import Vue from 'vue'
import axios from 'axios'
import Router from 'vue-router'
import whiteList from './whiteList'
import storage from '@/utils/storage'
import staticRouter from './staticRouter'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: '/wgMgr/',
  routes: staticRouter
})

/**
 * 路由跳转
 * @param link String
 */
// eslint-disable-next-line func-names
Router.prototype.openPage = function (link, query) {
  this.push({
      path: link,
      query: Object.assign({
          // time: new Date().getTime()
      }, query || {})
  })
};

/* 检测用户是否有权限访问页面 */
const pagePermission = (permissions, to, next) => {
  const allowPage = permissions.some(function (v) {
    return v.menuName === to.name
  })
  allowPage ? next() : next({ path: '/error/403' })
}
/* 权限控制 */
router.beforeEach((to, from, next) => {
  // 页面跳转进度条
  NProgress.start()
  /* 取消旧请求 */
  const CancelToken = axios.CancelToken
  router.app.$options.store.state.source.cancel && router.app.$options.store.state.source.cancel()
  router.app.$options.store.commit('updateSource', { source: CancelToken.source() })
  /* 进入登录页面将注销用户信息 */
  if (to.path === '/login') {
    localStorage.removeItem('user-token')
    localStorage.removeItem('user')
  }
  /* 免登录页面 */
  if (whiteList.indexOf(to.fullPath) >= 0) {
    return next()
  }
  const permissions = storage.getStorage('user')
  /* 上次会话结束，重新获取用户信息 */
  if (!permissions) {
    return next({ path: '/login' })
  } else {
    /* 已登录时判断页面权限 */
    pagePermission(permissions.permissions, to, next)
  }
})
router.afterEach(() => {
  NProgress.done()
})
export default router
