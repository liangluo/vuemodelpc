<template>
  <div class="page">
    <div class="login-box">
      <h3 class="login">用户登录</h3>
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-position="left"
        label-width="0px"
        class="demo-ruleForm login-container"
        status-icon
      >
        <el-form-item prop="account">
          <span style="margin-left: 2%">账号</span>
          <el-input
            type="text"
            v-model="ruleForm.account"
            auto-complete="off"
            placeholder="账号"
            id="loginEmail"
            style="float: right; width: 85%"
          ></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <span style="margin-left: 2%">密码</span>
          <el-input
            type="password"
            v-model="ruleForm.checkPass"
            auto-complete="off"
            placeholder="密码"
            id="loginPassword"
            style="float: right; width: 85%"
          ></el-input>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button
            type="primary"
            style="width: 100%"
            @click.native.prevent="handleSubmit"
            :loading="logining"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import storage from '@/utils/storage';
import staticRouter from '@/router/staticRouter';
import { requestLogin } from '@/api/user';

export default {
  name: 'app-login',
  data() {
    return {
      logining: false,
      fromUrl: '/index',
      ruleForm: {
        account: '',
        checkPass: ''
      },
      rules: {
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        checkPass: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      checked: false
    };
  },
  created() {
    storage.removeStorage('user-token');
    storage.removeStorage('user');
  },
  methods: {
    handleSubmit(ev) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.logining = true;
          const loginParams = {
            account: this.ruleForm.account,
            password: this.ruleForm.checkPass
          };
          this.login(loginParams); // 接口登录
          // this.testlogin();   //本地登录数据
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 请求接口
    login(data) {
      requestLogin(data).then((data) => {
        if (data.code == '0000' && data.innercode == '0000') {
          this.handlerUser(data);
        }
      }).catch(() => {
        this.logining = false;
      });
    },
    // 测试登录
    testlogin() {
      var data = { code: '0000', innercode: '0000', message: { adminVo: { adminId: 2, account: 'swhg', password: null, adminName: '市文化馆', mobile: '13712345678', createTime: '20210609103434', updateTime: '20210609103434', salt: null, status: 1, entId: 1, roleVo: { roleId: 1, roleName: '企业超级管理员', status: 1, createTime: '20210609104809', marker: null, menu: [{ menuId: 17, menuName: 'handlerecord', url: '/system/handlerecord', icon: null, parentId: null, status: 1, marker: null }, { menuId: 16, menuName: 'permissions', url: '/system/permissions', icon: null, parentId: null, status: 1, marker: '角色权限' }, { menuId: 15, menuName: 'menumanagement', url: '/system/menumanagement', icon: null, parentId: null, status: 1, marker: '菜单管理' }, { menuId: 14, menuName: 'management', url: '/system/management', icon: null, parentId: null, status: 1, marker: '用户管理' }, { menuId: 13, menuName: 'scenquery', url: '/resource/scenquery', icon: null, parentId: null, status: 1, marker: '地点预约信息' }, { menuId: 12, menuName: 'actquery', url: '/resource/actquery', icon: null, parentId: null, status: 1, marker: '活动报名信息' }, { menuId: 11, menuName: 'searchword', url: '/operations/searchword', icon: null, parentId: null, status: 1, marker: '搜索热词管理' }, { menuId: 10, menuName: 'advermanage', url: '/operations/advermanage', icon: null, parentId: null, status: 1, marker: '开屏广告管理' }, { menuId: 9, menuName: 'columnmanage', url: '/operations/columnmanage', icon: null, parentId: null, status: 1, marker: '栏目管理' }, { menuId: 8, menuName: 'pagemanage', url: '/operations/pagemanage', icon: null, parentId: null, status: 1, marker: '页面管理' }, { menuId: 7, menuName: 'scenmanage', url: '/content/scenmanage', icon: null, parentId: null, status: 1, marker: '地点管理' }, { menuId: 6, menuName: 'actmanage', url: '/content/actmanage', icon: null, parentId: null, status: 1, marker: '分类管理' }, { menuId: 5, menuName: 'videomanage', url: '/content/videomanage', icon: null, parentId: null, status: 1, marker: '场所管理' }, { menuId: 4, menuName: 'informationmanage', url: '/content/informationmanage', icon: null, parentId: null, status: 1, marker: '视频管理' }, { menuId: 3, menuName: 'labelmanage', url: '/content/labelmanage', icon: null, parentId: null, status: 1, marker: '活动管理' }, { menuId: 2, menuName: 'classifymanage', url: '/content/classifymanage', icon: null, parentId: null, status: 1, marker: '资讯管理' }, { menuId: 1, menuName: 'index', url: '/index', icon: null, parentId: null, status: 1, marker: '首页' }] }, newpassword: null }, adminToken: 'RkJBMDMwQkFEOTdGREQ2NDk1RTgwMTIw' } };
      this.handlerUser(data);
    },
    // 登录后
    handlerUser(data) {
      this.logining = false;
      data.message.adminVo.permissions = data.message.adminVo.roleVo.menu;
      this.$message({
        message: '登录成功！',
        type: 'success'
      });
      // 过滤菜单
      const res = data.message.adminVo;
      const filterUserMenu = function (menus, accessMenu) {
        menus.forEach(function (m) {
          if (m.noMenu) {
            return;
          }
          if (m.children) {
            const subMenu = [];
            filterUserMenu(m.children, subMenu);
            if (subMenu.length > 0) {
              const _aMenu = Object.assign({}, m);
              _aMenu.children = subMenu;
              accessMenu.push(_aMenu);
            }
          } else {
            res.roleVo.menu.some((p) => p.menuName === m.name) &&
              accessMenu.push(m);
          }
        });
      };
      const accessMenu = [];
      let menus = [];
      staticRouter.forEach((r) => {
        menus = r.menu ? menus.concat(r.children) : menus;
      });
      filterUserMenu(menus, accessMenu);
      res.accessMenu = accessMenu;
      storage.setStorage(
        'user-token',
        data.message.adminToken,
        1000 * 60 * 60 * 16
      );
      storage.setStorage('user', res);
      this.$router.push(this.fromUrl);
    }
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (from.fullPath !== '/register' && !from.meta.errorPage) {
        /*
        登录跳转上次退出登录页面
        */
        // vm.fromUrl = from.fullPath
        vm.fromUrl = '/index';
      }
    });
  }
};
</script>

<style scoped>
.page {
  position: absolute;
  height: 100%;
  width: 100%;
  background: url("../../assets/loginbg.png") top center no-repeat;
  background-size: cover;
  -webkit-background-size: cover; /* 兼容Webkit内核浏览器如Chrome和Safari */
  -o-background-size: cover; /* 兼容Opera */
  zoom: 1;
  overflow: visible;
  font-size: 16px;
  font-family: "Source Sans Pro", sans-serif;
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
}
.login {
  text-align: center;
  margin-bottom: 15px;
}
.login-box {
  position: absolute;
  top: 50%;
  left: 75%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  display: block;
  width: 100%;
  max-width: 400px;
  background-color: #fff;
  margin: 0;
  padding: 2.25em;
  box-sizing: border-box;
  border: solid 1px #ddd;
  border-radius: 0.5em;
  font-family: "Source Sans Pro", sans-serif;
}
</style>
