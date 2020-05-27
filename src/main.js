import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/common.scss'
// 按需引入element组件库
import {
  Button,
  MessageBox,
  Message,
  Alert,
  Input,
  Checkbox,
  Form,
  FormItem,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  Header,
  Main,
  Link,
  Card,
  Tabs,
  TabPane,
  Select,
  Option,
  Table,
  TableColumn,
  Pagination,
  Dialog,
  ColorPicker,
  Tag
} from 'element-ui'
// 按需引入echart
import VeLine from 'v-charts/lib/line.common'
Vue.use(Button)
Vue.use(Alert)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Checkbox)
Vue.use(Row);
Vue.use(Col);
Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Header);
Vue.use(Link);
Vue.use(Main);
Vue.use(Card);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Select);
Vue.use(Option);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(ColorPicker);
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.component(VeLine.name, VeLine)

Vue.config.productionTip = false
// 根据环境变量决定是否引入mock
if (process.env.NODE_ENV !== 'production' && !process.env.VUE_APP_BACK_END_URL) {
  const Mock = require('./mock/index').default
  Mock.mockData()
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
