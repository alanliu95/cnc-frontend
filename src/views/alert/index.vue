<template>
  <el-container>
    <el-header>
      <el-form ref="filter" v-loading="loading" :model="filters">
        <div class="div-float-left">
          <el-form-item>
            <el-input
              v-model="filters.name"
              class="deviceName"
              type="text"
              placeholder="设备名"
              auto-complete="on"
            />
          </el-form-item>
        </div>
        <div class="div-float-left">
          <el-form-item>
            <el-date-picker
              v-model="filters.time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="deviceTime"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </div>
        <div class="div-float-right">
          <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" @click.native.prevent="handleClear">重置</el-button>
        </div>
        <div class="div-float-right">
          <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" @click.native.prevent="handleFind">查询</el-button>
        </div>
      </el-form>
    </el-header>
    <el-main>
      <h3>对此功能有异议，暂不写了</h3>
      理由：所谓报警预测，应该是对设备当前使用情况的一种预测，或者预测机床的寿命，或者预测零件的寿命。理论上来说，功能是很复杂的，不是简单的统计某个时间段内报警情况
    </el-main>
  </el-container>
</template>

<script>
import { getForecast } from '@/api/data'

export default {
  name: 'Analysis',
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      filters: {
        time: '',
        name: '',
        number: 5,
        page: 1
      },
      loading: false,
      list: []
    }
  },

  mounted: function() {
    this.handleFind()
  },
  methods: {
    handleFind() {
      this.loading = true
      getForecast(this.filters).then(response => {
        this.list = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleClear() {
      this.filters.time = ''
      this.filters.name = ''
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-container {
    height: 100%;
  }

  .el-aside {
    border: 1px;
  }

  .el-header {
    background: aliceblue;
    margin: 12px;
  }

  .el-main {
    margin: 12px;
    /*float: right;*/
  }

  .el-tree {
    margin: 12px;
    color: #000000;
  }

  .deviceTime {
    width: 360px;
    margin: 12px;
  }

  .deviceName {
    width: 200px;
    padding: 12px;
  }

  .div-float-left {
    float: left;
  }

  .div-float-right {
    float: right;
    margin: 12px;
  }
</style>
