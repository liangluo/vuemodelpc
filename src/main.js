import "core-js";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/css/common.scss";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
// 按需引入element组件库
import ElementUI from "element-ui";
import VueClipboard from "vue-clipboard2";
import "element-ui/lib/theme-chalk/index.css";
// 按需引入echart
import VeLine from "v-charts/lib/line.common";
import { quillEditor } from "vue-quill-editor";
VueClipboard.config.autoSetContainer = true; // add this line
Vue.use(ElementUI);
Vue.use(quillEditor);
Vue.component(VeLine.name, VeLine);
Vue.use(VueClipboard);
Vue.config.productionTip = false;
// 根据环境变量决定是否引入mock
// if (process.env.NODE_ENV !== 'production' && !process.env.VUE_APP_BACK_END_URL) {
//   const Mock = require('./mock/index').default
//   Mock.mockData()
// }
if (!Array.prototype.find) {
  Array.prototype.find = function(callback) {
    return callback && (this.filter(callback) || [])[0];
  };
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

// 时间戳 yyyy-mm-dd 时间格式：20200820175002
Vue.filter("formatDBDateToDate", (time = "") => {
  if (!time) {
    return (time = "/");
  }
  const Year = time.slice(0, 4);
  const Month = time.slice(4, 6);
  const Day = time.slice(6, 8);
  return (time = `${Year}-${Month}-${Day}`);
});

// 时间戳 xxxx.xx.xx xx:xx 时间格式：20200820175002
Vue.filter("formatDateType2", (time = "") => {
  const Year = time.slice(0, 4);
  const Month = time.slice(4, 6);
  const Day = time.slice(6, 8);
  const hour = time.slice(8, 10);
  const fen = time.slice(10, 12);
  return (time = `${Year}.${Month}.${Day} ${hour}:${fen}`);
});
