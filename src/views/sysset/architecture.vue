<template>
  <el-container>
    <el-header>
      <el-form ref="filter" v-loading="loading" :model="filters">
        <div class="div-float-left">
          <el-form-item>
            <el-input
              ref="filterName"
              v-model="filters.name"
              class="deviceName"
              type="text"
              placeholder="名称"
              auto-complete="on"
            />
          </el-form-item>
        </div>
        <div class="div-float-left">
          <el-form-item class="deviceState">
            <el-select v-model="filters.state" placeholder="状态">
              <el-option label="正常" value="0" />
              <el-option label="停用" value="1" />
            </el-select>
          </el-form-item>
        </div>
        <!--    <div class="div-float-right">-->
        <!--      <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" @click.native.prevent="resetFilter">重置</el-button>-->
        <!--    </div>-->
        <!--    <div class="div-float-right">-->
        <!--      <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" @click.native.prevent="handleFind">查询</el-button>-->
        <!--    </div>-->
      </el-form>
    </el-header>
    <el-main></el-main>
  </el-container>
</template>

<script>
export default {
  name: 'Architecture',
  data() {
    return {
      filters: {
        name: '',
        state: ''
      },
      loading: false
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-container{
    height: 100%;
  }
  .el-header{
    background: aliceblue;
    margin: 12px;
  }
  .el-main{
    margin: 12px;
    /*float: right;*/
  }
  .deviceName{
    width: 200px;
    padding: 12px;
  }
  .deviceState{
    width: 160px;
    padding: 12px;
  }
  .div-float-left{
    float: left;
  }
  .div-float-right{
    float: right;
    margin: 12px;
  }
</style>
