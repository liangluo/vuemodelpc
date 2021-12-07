<template>
  <aside class="sidebar" :class="{'sidebar-hide': !openNav}">
    <el-menu :default-active="selectMenu" class="sidebar-menu" :collapse="!openNav"
             :collapse-transition="false" :router="true">
      <template v-for="menu in user.accessMenu">
        <el-menu-item v-if="!menu.children" :key="menu.name" :index="menu.path">
          <i :class="menu.icon" v-if="menu.icon"></i>
          <span slot="title">{{menu.title}}</span>
        </el-menu-item>
        <the-submenu :key="menu.name" :subMenu="menu" v-else></the-submenu>
      </template>
    </el-menu>
  </aside>
</template>
<script>
import TheLayoutSubSidebar from './TheLayoutSubSidebar'
import storage from '@/utils/storage'
export default {
  name: 'TheLayoutSidebar',
  data() {
    return {
      user: storage.getStorage('user')
    }
  },
  props: ['openNav'],
  components: {
    'the-submenu': TheLayoutSubSidebar
  },
  computed: {
    selectMenu () {
      return this.$route.meta.menuPath || this.$route.path
    }
  }
}
</script>
<style scoped lang="scss">
.sidebar {
  float: left;
  width: 240px;
  height: 100%;
  border-right: 1px solid #e6e6e6;
  overflow: auto;

  .sidebar-menu {
    border: none;
    height: 100%;
  }
}

.sidebar-hide {
  width: 65px;
}
</style>
