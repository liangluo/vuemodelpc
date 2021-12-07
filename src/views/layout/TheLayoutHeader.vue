<template>
  <el-header class="header el-button--primary">
    <router-link to="/index">
      <div class="logo" :class="{'logo-hide': !openNav}">
        <img src="../../assets/logo.png" class="image"/>
        <span class="text">武冈文旅</span>
      </div>
    </router-link>
    <div class="content">
      <i v-if="openNav" class="el-icon-s-fold toggle" @click="navOpenToggle" title="隐藏菜单"></i>
      <i v-else class="el-icon-s-unfold toggle" @click="navOpenToggle" title="显示菜单"></i>
    </div>
    <!-- <div class='themeselect'>
      <theme-picker></theme-picker>
    </div> -->
    <el-dropdown trigger="hover" class="user">
      <span class="user-info">
        {{ user.account }}<i class="el-icon-s-custom" style="margin-left: 10px"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
           <router-link to="/system/management"  >
            <el-link :underline="false">个人信息</el-link>
          </router-link>
        </el-dropdown-item>
         <el-dropdown-item>
           <router-link to="/system/permissions">
            <el-link :underline="false">角色权限</el-link>
          </router-link>
        </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>
<script>
import ThemePicker from '@/components/ThemePicker'
import storage from '@/utils/storage'
export default {
  name: 'TheLayoutHeader',
  data() {
    return {
      user: storage.getStorage('user')
    }
  },
  props: ['openNav'],
  components: {
    ThemePicker
  },
  methods: {
    navOpenToggle () {
      this.$emit('toggle-open')
    },
    logout () {
      // do something
      this.$router.push('/login')
    }
  }
}
</script>
<style scoped lang="scss">
.header {
  line-height: 60px;
  color: #ffffff;

  div {
    display: inline-block;
  }

  .logo {
    width: 240px;
    border-right: 1px solid #C0C4CC;
    margin-left: -20px;
    text-align: center;
    font-size: 25px;
    cursor: pointer;

    .image {
      width: 40px;
      height: 40px;
      vertical-align: middle;
    }

    .text {
      color: #ffffff;
    }
  }
  .logo-hide {
    width: 65px;

    .text {
      display: none;
    }
  }

  .content {
    padding: 0 20px;

    .toggle {
      font-size: 22px;
      cursor: pointer;
    }
  }
  .user {
    float: right;
    cursor: pointer;

    .user-info {
      color: #ffffff;

      i {
        vertical-align: middle;
      }
    }
  }
  .themeselect{
  float: right;
  margin-left: 20px;
  }
}
</style>
