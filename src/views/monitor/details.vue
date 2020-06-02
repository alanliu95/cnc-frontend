/* eslint-disable vue/no-use-v-if-with-v-for */
<template>
  <div v-loading="loading">
    <el-card>
      <div class="card-content">
        <div class="top-left">
          <img src="@/assets/ecoMill.jpg">
        </div>
        <div class="top-right">
          <div class="row">
            <label>设备型号：{{ detail.deviceName }}</label>
          </div>
          <div class="row row1">
            <span>IP地址：{{ detail.ip }}</span>
          </div>
          <div class="row row1">
            <span>操作员：{{ detail.operator }}</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="middle">
      <div v-for="(info,i) in detail.infoList" :key="'info'+i" class="middle-content">
        <img src="@/assets/mark.png">
        <h3>{{ info.title }}</h3>
        <div style="display: flex; width:100%;">
          <!-- 左侧 -->
          <div style="width:100%;">
            <div v-for="(item,index) in info.leftInfos" :key="'info'+i+'subInfo'+index">
              <div class="item">
                <div class="part part1" :style="index>0?'border-top:none;':''"> {{ item.name }}：</div>
                <div :class="{'part2':index>0, 'part3':index==info.leftInfos.length-1}" class="part"> {{ item.value }}
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧 -->
          <div style="width:100%;">
            <div v-for="(item,index) in info.rightInfos" :key="'info'+i+'subInfo'+index">
              <div class="item">
                <div class="part part1" :style="index>0?'border-top:none;':''"> {{ item.name }}：</div>
                <div :class="{'part2':index>0, 'part3':index==info.leftInfos.length-1}" class="part"> {{ item.value }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { getDevDetail } from '@/api/data'

  export default {
    name: 'Details',
    data() {
      return {
        loading: false,
        // data: ['', '', ''],
        detail: {
          deviceId: this.$route.query.id,
          deviceName: 'MTDC',
          ip: '10.110.20.30',
          operator: '张三',
          infoList: [
            {
              id: 0,
              title: '基本信息',
              subInfo: [
                {
                  id: 0,
                  name: '当前加工程序',
                  value: 'OIQW-2'
                },
                {
                  id: 1,
                  name: '加工零件个数',
                  value: '221'
                },
                {
                  id: 2,
                  name: '当前操作模式',
                  value: '自动'
                }
              ]
            },
            {
              id: 1,
              title: '参数信息',
              subInfo: [
                {
                  id: 0,
                  name: '机械坐标',
                  value: 'X-21,Y-18,Z-67'
                },
                {
                  id: 1,
                  name: '相对坐标',
                  value: 'X-21,Y-18,Z-67'
                },
                {
                  id: 2,
                  name: '切削倍率',
                  value: '87'
                }
              ]
            }
          ]
        }
      }
    },
    created() {
      // this.getDeviceInfo(this.$route.query.id)
      this.getDeviceInfo(this.$route.query.id)
      this.detail.infoList.forEach(element => {
        element.leftInfos = element.subInfo.filter((item, index) => {
          return index % 2 === 0
        })
        element.rightInfos = element.subInfo.filter((item, index) => {
          return index % 2 !== 0
        })
      })
      console.log(this.detail)
    },
    methods: {
      // getDeviceInfo(id) {
      //   // 获取设备信息
      //   this.loading = true
      //   getDetails(id).then(response => {
      //     this.data = response.data
      //   }).finally(() => {
      //     this.loading = false
      //   })
      // }
      getDeviceInfo(id) {
        getDevDetail(id).then(res => {


          // let temp = 1
          let raw = res.data.rawMsg
          this.detail.deviceId = raw.name
          this.detail.deviceName=raw.name
          // 当前加工程序
          this.detail.infoList[0].subInfo[0].value =raw.name
          //加工零件个数
          this.detail.infoList[0].subInfo[1].value = raw.products
          //当前操作模式
          this.detail.infoList[0].subInfo[2].value = raw.mode
          //机械坐标
          this.detail.infoList[1].subInfo[0].value = raw.mecpos
          //相对坐标
          this.detail.infoList[1].subInfo[1].value = raw.relpos
          //切削倍率
          this.detail.infoList[1].subInfo[2].value = raw.frate
        })
      }
    }
  }
</script>

<style lang="scss">
  .col-back {
    background: #f9f9f9;
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .top-left {
      img {
        width: 120px;
      }
    }

    .top-right {
      margin-left: 10px;

      .row {
        line-height: 30px;
      }

      .row1 {
        font-size: 14px;
      }
    }
  }

  .middle {
    margin-top: 20px;

    img {
      width: 20px;
      transform: translateY(3px);
    }

    h3 {
      display: inline-block;
    }

    .item {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #606266;
      font-size: 14px;

      .part {
        width: 50%;
        padding: 12px 0 12px 10px;
        border: 1px solid #ebeef5;
        border-right: none;
        line-height: 23px;
      }

      .part1 {
        background: #f9f9f9;
      }

      .part2 {
        border-top: none;
      }

      .part3 {
        border-right: 1px solid #ebeef5;
      }
    }
  }
</style>
