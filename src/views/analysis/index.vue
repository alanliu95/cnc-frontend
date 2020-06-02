<template>
  <el-container>
    <el-header style="height: 65px; min-width: 800px;">
      <el-form ref="filter" v-loading="loading" :model="filters" auto-complete="on">
        <div class="div-float-left">
          <el-form-item>
            <el-date-picker
              v-model="filters.time"
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
        <div class="div-float-left">
          <el-form-item>
            <el-input
              v-model="filters.name"
              class="deviceName"
              type="text"
              placeholder="设备名"
              auto-complete="on"
              tabindex="1"
              @keyup.enter.native="handleFind"
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
    <el-main ref="dataContainer">
      <div v-for="item in list" :key="item.id">
        <el-card style="margin-bottom: 20px;">
          <el-row>
            <span style="float: left">{{ item.name }}</span>
            <div style="float: right"><el-button size="mini" @click="viewUsageDetail(item.name, item.id)">更多 ></el-button></div>
          </el-row>
          <el-container>
            <el-aside>
              <!--显示饼图的容器-->
              <div :id="'pie'+item.name" style="height: 300px; width: 300px" />
            </el-aside>
            <el-main class="analysis-table">
              <div class='chart' :id="'progress'+item.name"></div>
              <el-table :data="item.log">
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <span v-if="scope.row.stage==='alarming'" style="color: #e2817e">{{ formatStage(scope.row.stage) }}</span>
                    <span v-else-if="scope.row.stage==='working'" style="color: #56bd80">{{ formatStage(scope.row.stage) }}</span>
                    <span v-else-if="scope.row.stage==='idling'" style="color: #d4cc68">{{ formatStage(scope.row.stage) }}</span>
                    <span v-else style="color: #8c9292">{{ formatStage(scope.row.stage) }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="开始时间" prop="start" />
                <el-table-column label="结束时间" prop="end" />
                <el-table-column label="持续时间" prop="duartion" />
                <el-table-column label="工序号" prop="operate" />
                <el-table-column label="程序名" prop="program" />
                <el-table-column label="操作者" prop="user" />
                <el-table-column label="信息" prop="msg" />
              </el-table>
            </el-main>
          </el-container>
        </el-card>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { getAnalysis, getWorkshops } from '@/api/data'
import echarts from 'echarts'

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
      devices: [],
      filters: {
        time: '', // 日期范围
        name: '', // 设备名称/类型
        id: 0 // 车间 ID
      },
      list: [
        {
          id:11033,
          name:'Fanuc-1',
          idling: 0.3,
          poweroff: 0.3,
          working: 0.3,
          alarming: 0.1,
          log: [{
            start: "10:10:10",
            end: "10:10:20",
            duartion: 10,
            stage: "working",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }, {
            start: "10:10:20",
            end: "10:10:50",
            duartion: 30,
            stage: "idling",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }, {
            start: "10:10:50",
            end: "10:10:80",
            duartion: 30,
            stage: "alarming",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }, {
            start: "10:10:20",
            duartion: 10,
            stage: "poweroff",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }]
		    },
		    {
          id:11035,
          name:'Fanuc-2',
          idling: 0.3,
          poweroff: 0.3,
          working: 0.3,
          alarming: 0.1,
          log: [{
            start: "10:10:10",
            end: "10:10:20",
            duartion: 10,
            stage: "alarming",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }, {
            start: "10:10:20",
            duartion: 10,
            stage: "working",
            operate: "c4343s",
            program: "device clean",
            user: "jack",
            msg: '无'
          }]
		    }
      ],
      loading: false,
      charts: [],
      progressCharts: []
    }
  },

  mounted: function() {
    // this.loading = true
    // getWorkshops().then(response => {
    //   this.devices = response.data
    //   if (this.devices.length === 0) return
    //   this.filters.id = this.devices[0].id
    //   this.handleFind()
    // }).finally(() => { this.loading = false })
    this.drawPie()
    this.drawProgress()
  },
  beforeDestroy() {
    this.clearChart()
  },
  destroyed() {
    // clearInterval(this.timer)
  },
  methods: {
    handleFind: function() {
      this.loading = true
      getAnalysis(this.filters).then(response => {
        // 取得数据
        this.list = response.data
        setTimeout(() => {
          this.drawPie()
          this.drawProgress()
        }, 100)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    handleSizeChange(val) {
    },
    handleCurrentPage(val) {
    },
    viewUsageDetail(name, id) {
      this.$router.push({ name: 'usageDetail', query: { name: name, id: id }})
    },
    handleClear() {
      this.filters.time = ''
      this.filters.name = ''
    },
    handleNodeClick(data) {
      // 点击车间
      if (this.filters.id === data.id) return
      this.filters.id = data.id
      this.handleFind()
    },
    clearChart() {
      // 清空页面上的饼图
      if (this.charts) {
        for (let i = 0; i < this.charts.length; i++){
          this.charts[i].dispose()
        }
        this.charts = null
      }
    },
    clearProgress() {
      // 清空页面上的进度条
      if (this.progressCharts) {
        for (let i = 0; i < this.progressCharts.length; i++){
          this.progressCharts[i].dispose()
        }
        this.progressCharts = null
      }
    },
    drawPie() { 
      // 清除现有图
      this.clearChart()
      this.charts = []
      // 重新绘图
      for (let i = 0; i < this.list.length; i++) {

        const chart = echarts.init(document.getElementById('pie'+this.list[i].name))
        this.charts.push(chart)
        chart.setOption({
          legend: {   
            orient: 'horizontal',
            x: 'right',
            y: 'bottom',
            textStyle: { //图例文字的样式
                color: '#8c9292',
                fontSize: 14, 
            }, 
            data: ['空闲', '关机', '运行', '报警']
          },
          series: {
            name: this.list[i].name,
            type: 'pie',
            radius: ['0%', '60%'],
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
                const colorList = ['#d4cc68', '#8c9292', '#56bd80', '#e2817e']
                return colorList[param.dataIndex]
              }
            },
            data: [{value:this.list[i].idling,name:'空闲'}, {value:this.list[i].poweroff,name:'关机'}, {value:this.list[i].working,name:'运行'}, {value:this.list[i].alarming,name:'报警'}]
          }
        })
      }
    },
    drawProgress() {
      // 清除现有图
      this.clearProgress()
      this.progressCharts = []
      // 重新绘图.
      for (let i = 0; i < this.list.length; i++) {
        let chart = echarts.init(document.getElementById('progress'+this.list[i].name))
        let subs = []
        for (let j = 0; j < this.list[i].log.length; j++) {
          let subProgress = {
              type: 'bar', // 系列类型
              name: this.list[i].log[j].stage, // 系列名称, 用于tooltip的显示, legend 的图例筛选
              // 数据堆叠，同个类目轴上系列配置相同的stack值后，后一个系列的值会在前一个系列的值上相加
              stack: '总量',
              // 图形上的文本标签
              label: {
                show: true,
                // 标签的位置 left right bottom top inside  // 绝对的像素值 position: [10, 10] 
                // 相对的百分比 position: ['50%', '50%']
                position: 'inside' 
              },
              // 图形样式
              itemStyle: {
                barBorderRadius: [j===0?10:0, j===this.list[i].log.length-1?10:0, j===this.list[i].log.length-1?10:0, j===0?10:0] // 圆角半径, 单位px, 支持传入数组分别指定 4 个圆角半径
              },
              data: [this.list[i].log[j].duartion] // 系列中的数据内容数组
          }
          subs.push(subProgress)
        }
        this.progressCharts.push(chart)
        // 监听屏幕变化自动缩放图表
        // window.addEventListener('resize', function () { chart.resize() })
        // 绘制图表
        chart.setOption({
          color: ['#8c9292', '#d4cc68', '#56bd80', '#e2817e'],
          // 设置图表的位置
          grid: {
            x: 60, // 左间距
            y: 80, // 上间距
            x2: 60, // 右间距
            y2: 40, // 下间距
            containLabel: true // grid 区域是否包含坐标轴的刻度标签, 常用于『防止标签溢出』的场景
          },
          // X轴
          xAxis: {
            type: 'value', // 坐标轴类型,   'value' 数值轴，适用于连续数据
            // 坐标轴刻度
            axisTick: {
              show: false // 是否显示坐标轴刻度 默认显示
            },
            // 坐标轴轴线
            axisLine: { // 是否显示坐标轴轴线 默认显示
              show: false // 是否显示坐标轴轴线 默认显示
            },
            // 坐标轴在图表区域中的分隔线
            splitLine: {
              show: false // 是否显示分隔线。默认数值轴显示
            },
            // 坐标轴刻度标签
            axisLabel: {
              show: false // 是否显示刻度标签 默认显示
            }
          },
          yAxis: [
            // 左侧Y轴
            {
              // 坐标轴类型,  'category' 类目轴，适用于离散的类目数据
              // 为该类型时必须通过 data 设置类目数据
              type: 'category', 
              // 坐标轴刻度
              axisTick: {
                show: false // 是否显示坐标轴刻度 默认显示
              },
              // 坐标轴轴线
              axisLine: { // 是否显示坐标轴轴线 默认显示
                show: false, // 是否显示坐标轴轴线 默认显示
                lineStyle: { // 坐标轴线线的颜色
                  color: '#cdd3ee'
                }
              },
              // 坐标轴在图表区域中的分隔线
              splitLine: {
                show: false // 是否显示分隔线。默认数值轴显示
              },
              // 坐标轴刻度标签
              axisLabel: {
                show: false, // 是否显示刻度标签 默认显示
              },
              // 类目数据，在类目轴（type: 'category'）中有效
              data: ['MTDS'] 
            }
          ],
          // 系列列表
          series: subs
        })
      }
    },

    formatStage(stage){
      switch(stage){
        case 'alarming':
            return '报警'
        case 'idling':
            return '空闲'
        case 'working':
            return '运行'
        default:
            return '关机'
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .el-container{
    height: 100%;
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
    color: #000000;
  }
  .deviceTime{
    width: 360px;
    margin: 12px;
  }
  .deviceName{
    width: 200px;
    padding: 12px;
  }
  .div-float-left{
    float: left;
  }
  .div-float-right{
    float: right;
    margin: 12px;
  }
  .analysis-table .el-table thead {
    color: #606266;
  }
  .analysis-table .el-table .el-table__body-wrapper {
    color: #909399;
  }
  .chart {
    width: 100%;
    height: 100px;
  }
</style>
