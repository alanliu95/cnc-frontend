<template>
  <div v-loading="loading">
    <el-card>
      <h2>盒子信息可能需要考虑设备实际情况，展示的信息对客户而言是否需要</h2>
      <h3>工厂名称：{{ data.name }}</h3>
      <div>地址：{{ data.addr }}</div>
      <div>负责人：{{ data.admin }}</div>
      <div>电话：{{ data.tell }}</div>
    </el-card>
    <div v-for="item in list" :key="item.key">
      <h3>{{ item.key }}</h3>
      <el-table :data="item.data">
        <el-table-column label="序号" type="index" />
        <el-table-column label="机床名" prop="name" />
        <el-table-column label="盒子MAC" prop="mac" />
        <el-table-column label="IP" prop="ip" />
        <el-table-column label="实时数据" prop="eth" />
        <el-table-column label="状态" prop="state" />
      </el-table>
    </div>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentPage"
      :disabled="total <= number"
      :total="total"
      :current-page.sync="page"
      background
      :page-sizes="[5, 10, 15, 20]"
      :page-size="5"
      layout="total, sizes, prev, pager, next, jumper"/>
  </div>
</template>

<script>

import { getFactoryInfo, getFactoryTotal, getFactoryData } from '@/api/data'

export default {
  name: 'Factory',
  data() {
    return {
      loading: false,
      data: {
        name: '',
        addr: '',
        admin: '',
        tell: ''
      },
      total: 0,
      number: 5,
      page: 1,
      list: []
    }
  },
  mounted() {
    this.getInfo()
      .then(() => this.getTotal())
      .then(() => this.getData())
  },
  methods: {
    async getInfo() {
      this.loading = true
      this.ok = true
      await getFactoryInfo()
        .then(response => { this.data = response.data })
        .finally(() => { this.loading = false })
    },
    async getTotal() {
      this.loading = true
      await getFactoryTotal({ num: this.number })
        .then(response => { this.total = response.data })
        .finally(() => { this.loading = false })
    },
    async getData() {
      this.loading = true
      await getFactoryData({ num: this.number, page: this.page })
        .then(response => { this.list = response.data })
        .finally(() => { this.loading = false })
    },
    handleSizeChange(val) {
      // 每页数据量变化
      this.number = val
      this.page = 1
      this.getTotal().then(() => this.getData())
    },
    handleCurrentPage(val) {
      // 选择页
      this.getData()
    }
  }
}
</script>

<style scoped>

</style>
