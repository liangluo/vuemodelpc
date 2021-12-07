import axios from 'axios'
import qs from 'qs'
import store from '../store/index'
import { MessageBox, Message } from 'element-ui'
import storage from '@/utils/storage'

export function getENV() {
  // 1.本地  2线上
  const url = window.location.origin;
  // eslint-disable-next-line no-nested-ternary
  return url.indexOf('localhost') > -1 ? 1 : 2;
}
const host = window.location.origin; // 打包的接口地址
const axiosCustom = axios.create({
  baseURL: getENV() === 2 ? `${host}` : '/api',
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization,Origin,X-Requested-With,Content-Type,Accept'
  }
})
axiosCustom.interceptors.request.use(function (config) {
  config.headers.adminToken = storage.getStorage('user-token')
  return config
})

/* 普通请求 */
export const request = (url, params = {}, config = {}, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  const args = Object.assign({
    method: 'post',
    url: url,
    data: params
  }, config)
  // 处理url传参
  if (!['put', 'post', 'patch'].includes(args.method.toLowerCase())) {
    args.params = args.params || args.data
    args.paramsSerializer = args.paramsSerializer || function (params) {
      return qs.stringify(params, { arrayFormat: 'indices' })
    }
  }
  return axiosCustom(args).then((res) => {
    // 未登录
    // if (res.data.type === 'login' || !res.config.headers.adminToken) {
		if(null!=res.config.headers.adminToken||undefined!=res.config.headers.adminToken){
			if (!res.config.headers.adminToken) {
				Message({ message: '登录失效，请重新登录', type: 'error' })
				window.location.href = '/mgrwl/#/login'
			}
		}
    // 自动处理返回格式错误
    // eslint-disable-next-line no-prototype-builtins
    if (autoErrorData && res.data.hasOwnProperty('code') && res.data.code !== '0000') {
      console.error(res.data)
      const errMsg = res.data.message || '未知的服务器错误，请联系管理员！'
      MessageBox.alert(errMsg, '温馨提示：', {
        confirmButtonText: '确定',
        customClass: 'zZindex'
      })
      if (res.data.code == '9999' && res.data.innercode == '8888') {
        MessageBox.alert(errMsg, '温馨提示：', {
          confirmButtonText: '确定',
          customClass: 'zZindex',
          callback: action => {
            window.location.href = '/mgrwl/#/login'
          }
        })
      }
      return Promise.reject(res.data)
    }
    return res.data
  }, (error) => {
    // 自动处理网络请求错误
    console.error(error)
    error.response = error.response || {}
    const errStatus = error.response.status || -100
    if (autoErrorRes && error.message) {
      MessageBox.alert('网络请求异常，请联系管理员！', '请求异常：' + errStatus, { confirmButtonText: '确定', customClass: 'zZindex' })
    }
    return Promise.reject(error)
  })
}

/* 使用sessionStorage缓存的请求 */
export const sessionRequest = (url, params = {}, config = {}, outTime = -1, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  const itemKey = url + '#' + JSON.stringify(params) + JSON.stringify(config)
  let itemVal = sessionStorage.getItem(itemKey)
  const nowTime = new Date().getTime()
  if (itemVal) {
    itemVal = JSON.parse(itemVal)
    const overTime = nowTime - itemVal.lastTime
    if (outTime < 0 || overTime < outTime * 1000) {
      return Promise.resolve(itemVal.data)
    }
  }
  return request(url, params, config, autoErrorRes, autoErrorData, autoCancel).then(data => {
    sessionStorage.setItem(itemKey, JSON.stringify({
      lastTime: nowTime,
      data: data
    }))
    return data
  })
}

/* 使用localStorage缓存的请求 */
export const localRequest = (url, params = {}, config = {}, outTime = 604800, autoErrorRes = true, autoErrorData = true, autoCancel = true) => {
  const itemKey = url + '#' + JSON.stringify(params) + JSON.stringify(config)
  let itemVal = localStorage.getItem(itemKey)
  const nowTime = new Date().getTime()
  if (itemVal) {
    itemVal = JSON.parse(itemVal)
    const overTime = nowTime - itemVal.lastTime
    if (outTime < 0 || overTime < outTime * 1000) {
      return Promise.resolve(itemVal.data)
    }
  }
  return request(url, params, config, autoErrorRes, autoErrorData, autoCancel).then(data => {
    localStorage.setItem(itemKey, JSON.stringify({
      lastTime: nowTime,
      data: data
    }))
    return data
  })
}

export const dateFormat = (fmt, date) => {
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString()// 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return fmt;
};
