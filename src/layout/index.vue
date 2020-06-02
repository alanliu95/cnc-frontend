<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <el-container>
      <el-header height="auto" style="background: #58a3f7">
        <div class="title" style="float: left;display: flow; align-items: center; justify-content: stretch; text-align: justify-all">
          <router-link :to="main">生根互联</router-link>
        </div>
        <div style="float: left">
          <el-menu
            class="el-menu-demo"
            mode="horizontal"
            text-color="#fff"
            :default-active="$route.path"
            background-color="#58a3f7"
            active-text-color="#ffd04b"
            @select="handleSelect"
          >
            <el-menu-item v-for="item in menus" :key="item.key" :index="item.key">{{ item.text }}</el-menu-item>
            <!--            <el-menu-item index="/monitor">>设备实时状态</el-menu-item>-->
            <!--            <el-menu-item index="/analysis">设备利用率</el-menu-item>-->
            <!--            <el-menu-item index="/alert">报警预测</el-menu-item>-->
            <!--            <el-menu-item index="/sysset">系统设置</el-menu-item>-->
          </el-menu>
        </div>
        <div class="right-menu">
          <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
              <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
              <i class="el-icon-caret-bottom" />
            </div>
            <el-dropdown-menu slot="dropdown" class="user-dropdown">
              <router-link :to="main">
                <el-dropdown-item>
                  首页
                </el-dropdown-item>
              </router-link>
              <el-dropdown-item divided @click.native="logout">
                <span style="display:block;">退出</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main style="background: rgb(240, 242, 245);">
        <div class="main">
          <app-main />
        </div>
      </el-main>
    </el-container>
    <!--    <sidebar class="sidebar-container" />-->
    <!--    <div class="main-container">-->
    <!--      <div :class="{'fixed-header':fixedHeader}">-->
    <!--        <navbar />-->
    <!--      </div>-->
    <!--      <app-main />-->
    <!--    </div>-->
  </div>
</template>

<script>
import { AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',
  components: {
    // Navbar,
    // Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      menus: [],
      main: ''
    }
  },
  computed: {
    ...mapGetters([
      'avatar'
    ]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  mounted() {
    if (this.$route.path.indexOf('/admin') < 0) {
      this.main = '/'
      this.menus = [{ key: '/monitor', text: '设备实时状态' }, { key: '/analysis', text: '设备利用率' },
        { key: '/alert', text: '报警预测' }, { key: '/sysset', text: '系统设置' }]
    } else {
      this.main = '/admin/index'
      this.menus = [{ key: '/admin/index', text: '工厂管理' }, { key: '/admin/usermgmt', text: '用户管理' }]
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    handleSelect(key) {
      if (key) this.$router.push({ path: key })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      if (this.$route.path.indexOf('/admin') < 0) {
        this.$router.push(`/login`)
      } else {
        this.$router.push(`/admin`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: 100%;
    // width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  /*.hideSidebar .fixed-header {*/
  /*  width: calc(100% - 54px)*/
  /*}*/

  .mobile .fixed-header {
    width: 100%;
  }
  .right-menu {
    position: relative;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;
        transform: translateY(10px);

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .title {
    float: left;
    display: flow;
    align-items: center;
    justify-content: stretch;
    text-align: justify-all;
    margin-right: 50px;
    height: 60px;
    line-height: 60px;
    color: #fff;
  }
</style>
