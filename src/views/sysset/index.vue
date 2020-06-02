<template>
  <el-container>
    <el-aside width="160px">
      <el-menu
        default-active="1"
        @select="handleMenuClick">
        <el-menu-item index="1">
          <span slot="title">组织架构</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">机床配置</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">人员账号</span>
        </el-menu-item>
        <el-menu-item index="4">
          <span slot="title">功能权限</span>
        </el-menu-item>
        <el-menu-item index="5">
          <span slot="title">日志管理</span>
        </el-menu-item>
        <el-menu-item index="6">
          <span slot="title">登陆日志</span>
        </el-menu-item>
        <el-menu-item index="7">
          <span slot="title">操作日志</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container><componet :is="currentPage" /></el-container>
  </el-container>
</template>

<script>
import architecture from '@/views/sysset/architecture.vue'
import usermgr from '@/views/sysset/usermgr.vue'

export default {
  name: 'Index',
  components: { usermgr },
  data() {
    return {
      currentPage: 'architecture'
    }
  },
  methods: {
    handleMenuClick(data) {
      console.log(data)
      switch (data) {
        case 1:
          this.currentPage = 'architecture'
          break
        case 2:
          break
        case 3:
          this.currentPage = 'usermgr'
          break
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .workspace{
    height: 100%;
  }
  .el-aside{
    border: 1px;
    margin: 2px;
    padding: 12px;
  }
  .el-header{
    background: aliceblue;
    margin: 12px;
  }
  .el-main{
    margin: 12px;
    /*float: right;*/
  }
</style>
