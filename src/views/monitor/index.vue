<template>
  <el-container>
    <el-aside width="200px">
      <div>
        设备状态
      </div>
      <el-tree
        ref="tree"
        :props="defaultProps"
        :data="devices"
        highlight-current
        node-key="id"
        @node-click="handleNodeClick"
      />
    </el-aside>
    <el-container>
      <el-header style="height: 65px;">
        <el-form ref="filter" v-loading="loading" :model="filters" auto-complete="on">
          <div class="div-float-left">
            <el-form-item>
              <el-input
                ref="filterName"
                v-model="filters.name"
                class="deviceName"
                type="text"
                placeholder="设备名"
                auto-complete="on"
                tabindex="0"
                @keyup.enter.native="handleFind"
              />
            </el-form-item>
          </div>
          <div class="div-float-left">
            <el-form-item class="deviceState">
              <el-select v-model="filters.state" placeholder="设备状态" tabindex="0" @keyup.enter.native="handleFind">
                <el-option label="关机" value="0" />
                <el-option label="运行" value="1" />
                <el-option label="空闲" value="2" />
                <el-option label="报警" value="3" />
              </el-select>
            </el-form-item>
          </div>
          <div class="div-float-right">
            <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" tabindex="3" @click.native.prevent="resetFilter">重置</el-button>
          </div>
          <div class="div-float-right">
            <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" tabindex="2" @click.native.prevent="handleFind">查询</el-button>
          </div>
        </el-form>
      </el-header>
      <el-main>
        <el-table
          class="minitor-table"
          :data="list"
          fit
          :row-class-name="setRowColor"
          @row-click="handleRowClick"
        >
          <el-table-column label="设备名称" prop="name" min-width="100px" />
          <el-table-column label="运行时长" sortable prop="time" min-width="110px" />
          <el-table-column label="空闲时长" sortable prop="freetime" min-width="110px" />
          <el-table-column label="报警时长" sortable prop="alerttime" min-width="110px" />
          <el-table-column label="利用率" sortable prop="usage" min-width="100px" />
          <el-table-column label="进给倍率" sortable prop="given" min-width="110px" />
          <el-table-column label="主轴倍率" sortable prop="main" min-width="110px" />
          <el-table-column label="状态" prop="state" />
        </el-table>
        <el-pagination
          :disabled="total <= filters.num"
          :total="total"
          :current-page.sync="filters.page"
          background
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentPage"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getSummaryTotal, getSummary, getWorkshops, getAllDevStatus } from '@/api/data'

export default {
  name: 'Monitor',
  data() {
    return {
      defaultProps: {
        children: 'c',
        label: 'n'
      },
      devices: [],
      filters: {
        name: '',
        state: '',
        id: 0, // 车间 ID
        num: 5,
        page: 1
      },
      list: [],
      total: 0,
      loading: false
    }
  },

  mounted() {
    // this.getTotal().then(() => {
    //   if (this.total > 0) this.initial()
    // })
    this.getAllStatus()
  },
  destroyed() {
    clearInterval(this.timer)
  },

  methods: {
    initial() {
      this.loading = true
      getWorkshops().then(response => {
        this.devices = response.data
        if (this.devices.length === 0) return
        this.devices.forEach(item => {
          item.time = this.formatSeconds(item.time)
          item.freetime = this.formatSeconds(item.freetime)
          item.alerttime = this.formatSeconds(item.alerttime)
        })
        this.filters.id = this.devices[0].id
        this.handleFind()
        if (this.timer) clearInterval(this.timer)
        else {
          this.timer = setInterval(() => {
            this.handleFind()
          }, 500)
        }
      }).finally(() => { this.loading = false })
    },
    formatSeconds(value) {
      var secondTime = parseInt(value) // 秒
      var minuteTime = 0 // 分
      var hourTime = 0 // 小时
      if (secondTime > 60) {
        // 获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60)
        // 获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60)
        // 如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          // 获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60)
          // 获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60)
        }
      }
      var result = '' + parseInt(secondTime)
      if (minuteTime > 0) {
        result = '' + parseInt(minuteTime) + ':' + result
      }
      if (hourTime > 0) {
        result = '' + parseInt(hourTime) + ':' + result
      }
      return result
    },
    handleFind() {
      // 获取设备当前信息数据
      this.loading = true
      // console.debug(this.filters)
      getSummary(this.filters).then(response => {
        this.list = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
      // 每页数据量发生变化
      // 1、设置过滤条件中每页显示的数量
      this.filters.num = val
      this.filters.page = 1
      // 2、重新获取数据
      this.handleFind()
    },
    handleCurrentPage(val) {
      // 当前页发生变化
      this.handleFind()
    },
    jumpTo(name, id) {
      // 跳转函数
      this.$router.push({ name: name, query: { id: id }})
    },
    handleRowClick(row, col, event) {
      if (col.property === 'usage') {
        // 查看设备使用率数据
        this.jumpTo('usageDetail', row.name) // 暂时传递名称，后续改为传 ID
      } else {
        // 查看设备信息
        this.jumpTo('deviceInfo', row.name) // 暂时传递名称，后续改为传 ID
      }
    },
    async getTotal() {
      this.loading = true
      await getSummaryTotal(this.filters).then(response => {
        this.total = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    resetFilter() {
      this.filters.name = ''
      this.filters.state = ''
    },
    handleNodeClick(data) {
      if (this.filters.id === data.id) return
      this.filters.id = data.id
      this.handleFind()
    },
    setRowColor({ row, rowIndex }) {
      switch (row.state) {
        case '关机':
          return 'row-off'
        case '空闲':
          return 'row-free'
        case '运行':
          return 'row-run'
        case '报警':
          return 'row-alert'
        default:
          return ''
      }
    },
    getAllStatus() {
      getAllDevStatus().then(res => {
        this.list = res.data
      })
    }
  }

}
</script>

<style>
  .minitor-table {
    min-width: 850px;
    color: #fff;
  }
  .minitor-table td  {
    font-size: 16px;
    font-weight: bold;
  }
  .minitor-table .row-off {
    background: #8c9292;
    height: 80px;
  }
  .el-table--enable-row-hover .el-table__body .row-off:hover>td{
    background: #a7a6a6 !important;
    cursor: pointer;
  }
  .minitor-table .row-free {
    background: #d4cc68;
    height: 80px;
  }
  .el-table--enable-row-hover .el-table__body .row-free:hover>td{
    background: #dad373 !important;
    cursor: pointer;
  }
  .minitor-table .row-run {
    background: #56bd80;
    height: 80px;
  }
  .el-table--enable-row-hover .el-table__body .row-run:hover>td{
    background: #65d492 !important;
    cursor: pointer;
  }
  .minitor-table .row-alert {
    background: #e2817e;
    height: 80px;
  }
  .el-table--enable-row-hover .el-table__body .row-alert:hover>td{
    background: #eb8b88 !important;
    cursor: pointer;
  }
  .minitor-table .el-table__body .el-table__row td {
    border: 3px solid rgb(240, 242, 245);
    border-left: none;
    border-right: none;
  }
</style>

<style lang="scss" scoped>
  .el-aside{
    padding: 15px;
    color: #636363;
    font-weight: bold;
    border-radius: 5px;
    background: #fff;
  }
  .el-header{
    background: #fff;
    border-radius: 5px;
    margin: 0 10px 0 30px;
  }
  .el-main{
    margin: 12px;
  }
  .el-tree{
    margin: 12px;
    color: #636363;
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
