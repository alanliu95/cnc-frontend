<template>
  <el-container>
    <el-header>
      <el-form ref="filter" auto-complete="on">
        <div class="div-float-left">
          <el-form-item>
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              class="deviceTime"
              auto-complete="on"
              tabindex="0"
              :picker-options="pickerOptions"
            />
          </el-form-item>
        </div>
        <div class="div-float-right">
          <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" tabindex="3" @click.native.prevent="handleClear">重置</el-button>
        </div>
        <div class="div-float-right">
          <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" tabindex="2" @click.native.prevent="handleFind">查询</el-button>
        </div>
      </el-form>
    </el-header>
    <el-main v-loading="loading">
      <div style="text-align: center">{{ data.name }}</div>
      <el-container>
        <el-aside>
          <div id="chart" style="height: 90%; width: 100%" />
        </el-aside>
        <el-main>
          <div>
            <label style="color: red">当前设备利用率：{{ summary1.rate }}%</label>
          </div>
          <el-table
            :data="summary1.data"
            style="font-weight: bold"
            :show-header="false">
            <el-table-column prop="c1" />
            <el-table-column prop="c2" />
            <el-table-column prop="c3" />
            <el-table-column prop="c4" />
          </el-table>
          <el-table
            :data="summary2"
            border
            :show-header="false">
            <el-table-column prop="c1" />
            <el-table-column prop="c2" />
            <el-table-column prop="c3" />
            <el-table-column prop="c4" />
          </el-table>
          <el-pagination
            @size-change="summary2SizeChange"
            @current-change="summary2Page"
            :disabled="total2 <= total2"
            :total="total2"
            :current-page.sync="filter2.page"
            background
            :page-sizes="[5, 10, 15, 20]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"/>
        </el-main>
      </el-container>
      <el-table border :data="detail">
        <el-table-column label="状态" prop="state" />
        <el-table-column label="原因" prop="reason" />
        <el-table-column label="操作者" prop="opt" />
        <el-table-column label="开始时间" prop="start" />
        <el-table-column label="结束时间" prop="end" />
        <el-table-column label="持续时间" prop="last" />
        <el-table-column label="工序号" prop="optNo" />
        <el-table-column label="程序名" prop="prog" />
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentPage"
        :disabled="totald <= totald"
        :total="totald"
        :current-page.sync="filterd.page"
        background
        :page-sizes="[5, 10, 15, 20]"
        :page-size="5"
        layout="total, sizes, prev, pager, next, jumper"/>
    </el-main>
  </el-container>
</template>

<script>

import { getUsageSummary1, getUsageTotal2, getUsageSummary2, getUsageTotald, getUsageDetail } from '@/api/data'
import echarts from 'echarts'

export default {
  name: 'Usage',
  data() {
    return {
      loading: false,
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
      data: {
        name: '',
        id: 0
      }, // 传过来的参数
      time: '', // 选择的日期范围
      filtertime: null, // 当前过滤使用的日期范围
      summary1: { rate: '', values: [], data: [] },
      summary2: [],
      total2: 0, // 摘要2的总页数
      filter2: {
        number: 5, // 每页显示的数量
        page: 1 // 第几页
      }, // 摘要2的过滤条件
      detail: [], // 使用记录
      totald: 0, // 使用记录的总页数
      chart: null,
      filterd: {
        number: 5, // 每页显示的数量
        page: 1 // 第几页
      } // 使用记录过滤条件
    }
  },
  mounted() {
    this.data = this.$route.query
    setTimeout(() => { this.handleFind() }, 200)
    // this.handleFind()
  },
  beforeDestroy() {
    if (this.chart) this.chart.dispose()
  },
  methods: {
    handleFind() {
      // 查询按钮
      if (this.filtertime === this.time) return
      // 1、重置过滤条件
      this.filtertime = this.time
      this.filter2.page = 1
      this.filter2.page = 1
      // 2、获取摘要1 summary1
      this.getSummary1()
        // 3、获取摘要2 summary2 总数
        .then(() => this.getTotal2())
      // 4、获取摘要2 summary2
        .then(() => this.getSummary2())
      // 5、获取摘要2 detail 总数
        .then(() => this.getTotald())
      // 6、获取使用情况数据 detail
        .then(() => this.getDetail())
    },
    summary2SizeChange(val) {
      // 选择 summary2 的每页数据量
      // 1、获取总页数
      this.getTotal2().then(() => {
        // 2、获取第一页数据
        this.filter2.page = 1
        this.getSummary2()
      })
    },
    summary2Page(val) {
      // summary2 换页
      this.getSummary2()
    },
    handleSizeChange(val) {
      // detail 每页数据量发生变化
      // 1、获取总页数
      this.getTotald().then(() => {
        // 2、获取第一页数据
        this.filterd.page = 1
        this.getDetail()
      })
    },
    handleCurrentPage(val) {
      // detail 换页
      this.getDetail()
    },
    async getSummary1() {
      // 获取 summary1 数据
      this.loading = true
      await getUsageSummary1({ id: this.data.id, time: this.filtertime }).then(response => {
        this.summary1 = response.data
        this.drawPie()
      }).finally(() => { this.loading = false })
    },
    async getTotal2() {
      // 获取 summary2 总页数
      this.loading = true
      await getUsageTotal2({ id: this.data.id, time: this.filtertime, num: this.filter2.number }).then(response => {
        this.total2 = response.data
      }).finally(() => { this.loading = false })
    },
    async getSummary2() {
      // 获取 summary2 数据
      this.loading = true
      await getUsageSummary2({ id: this.data.id, time: this.filtertime, num: this.filter2.number, page: this.filter2.page }).then(response => {
        this.summary2 = response.data
      }).finally(() => { this.loading = false })
    },
    async getTotald() {
      // 获取 detail 总页数
      this.loading = true
      await getUsageTotald({ id: this.data.id, time: this.filtertime, num: this.filterd.number }).then(response => {
        this.totald = response.data
      }).finally(() => { this.loading = false })
    },
    async getDetail() {
      // 获取 detail 数据
      this.loading = true
      await getUsageDetail({ id: this.data.id, time: this.filtertime, num: this.filterd.number, page: this.filterd.page }).then(response => {
        this.detail = response.data
      }).finally(() => { this.loading = false })
    },
    drawPie() {
      if (this.chart) this.chart.dispose()
      this.chart = echarts.init(document.getElementById('chart'))
      this.chart.setOption({
        legend: {
          bottom: 0,
          left: 'center',
          // orient: 'horrible',
          data: this.getLegend()
        },
        series: {
          name: 'chart',
          type: 'pie',
          radius: ['0%', '80%'],
          avoidLabelOverlap: false,
          label: {
            formatter: '{d}%'
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          itemStyle: {
            color: function(param) {
              const colorList = ['#fab978', '#bca2de', '#2ec0c9', '#d87a80']
              return colorList[param.dataIndex]
            }
          },
          data: this.summary1.values
        }
      })
    },
    getLegend() {
      const data = []
      for (let i = 0; i < 4; i++) data.push(this.summary1.values[i].name)
      return data
    },
    handleClear() {
      // 重置按钮
      this.time = ''
    }
  }
}
</script>

<style scoped>
  .el-header{
    background: aliceblue;
    margin: 12px;
  }
  .deviceTime{
    width: 360px;
    margin: 12px;
  }
  .div-float-left{
    float: left;
  }
  .div-float-right{
    float: right;
    margin: 12px;
  }
</style>
