/* eslint-disable */ 
/*
    storage 主要放项目中的storage相关操作：存取等
*/
const storage = {
  /**
     对本地数据进行操作的相关方法，如localStorage,sessionStorage的封装
     */
  setStorage(key, value, duration) {
    let data = {
      value,
      expiryTime: !duration || isNaN(duration) ? 0 : this.getCurrentTimeStamp() + parseInt(duration),
    };
    data = encodeURIComponent(JSON.stringify(data));
    localStorage[key] = data;
  },
  getStorage(key) {
    let data = localStorage[key];
    if (!data || data === 'null') {
      return null;
    }
    const now = this.getCurrentTimeStamp();
    let obj;
    try {
      data = decodeURIComponent(data);
      obj = JSON.parse(data);
    } catch (e) {
      return null;
    }
    if (obj.expiryTime === 0 || obj.expiryTime > now) {
      return obj.value;
    }
    return null;
  },
  removeStorage(key) {
    localStorage.removeItem(key);
  },
  getSession(key) {
    const data = sessionStorage[key];
    if (!data || data === 'null') {
      return null;
    }
    return JSON.parse(data).value;
  },
  setSession(key, value) {
    const data = {
      value,
    };
    sessionStorage[key] = JSON.stringify(data);
  },
  getCurrentTimeStamp() {
    return Date.parse(new Date());
  },
  addCookie(key, value, expiresTime) {
    const cookieString = `${key}=${escape(value)}`;
    if (expiresTime > 0) {
      const date = new Date();
      date.setTime(date.getTime() + expiresTime);
      cookieString = `${cookieString};expires=${date.toGMTString()};path=/`;
    }
    document.cookie = `${cookieString};path=/`;
  },
  getCookie(key) {
    let arr; const
      reg = new RegExp(`(^| )${key}=([^;]*)(;|$)`);
    // eslint-disable-next-line no-cond-assign
    if (arr = document.cookie.match(reg)) {
      return (arr[2]);
    }
    return '';
  },
};
export default storage;
