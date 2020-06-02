<template>
  <el-container v-loading="loading">
    <el-header>
      <div style="float: left; font-weight: bold">{{ data.name }} — 车间列表</div>
    </el-header>
    <el-main>
      <el-button type="primary" @click="addShop">添加车间</el-button>
      <el-table :data="list">
        <el-table-column label="序号" type="index" />
        <el-table-column label="车间名称" prop="name" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="delShop(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="删除提示" :visible.sync="visible">
        <span>是否要删除该车间：{{ shop }}</span>
        <span slot="footer">
          <el-button @click="visible = false">否</el-button>
          <el-button @click="onConfirmDel">是</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加车间" :visible.sync="visibleNew">
        <el-input
          v-model="shop"
          class="factoryName"
          type="text"
          placeholder="车间名称"
          auto-complete="on"
          tabindex="0"
          @keyup.enter.native="onConfirmAdd"
        />
        <span slot="footer">
          <el-button @click="visibleNew = false">否</el-button>
          <el-button @click="onConfirmAdd">是</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>

import { delWorkshop, getWorkshop, addWorkshop } from '@/api/admin'

export default {
  name: 'Workshops',
  data() {
    return {
      loading: false,
      list: [],
      data: {
        name: '',
        id: 0
      },
      shop: '',
      delIndex: 0,
      delID: 0,
      visible: false,
      visibleNew: false
    }
  },
  mounted() {
    this.data = this.$route.query
    this.getWorkshops()
  },
  methods: {
    getWorkshops() {
      this.loading = true
      getWorkshop(this.data.id).then(response => {
        this.list = response.data
      }).finally(() => { this.loading = false })
    },
    delShop(idx, row) {
      console.log(row)
      this.delIndex = idx
      this.delID = row.id
      this.visible = true
    },
    onConfirmDel() {
      // 删除车间
      this.loading = true
      // 1、执行删除操作
      delWorkshop(this.delID).then(response => {
        if (response.data.code === '1') {
          // 2、从列表中移除
          this.list.splice(this.delIndex, 1)
        } else {
          alert(response.data.msg)
        }
      }).finally(() => {
        this.visible = false
        this.loading = false
      })
    },
    addShop() {
      this.shop = ''
      this.visibleNew = true
    },
    onConfirmAdd() {
      // 添加车间
      this.loading = true
      addWorkshop(this.shop).then(response => {
        if (response.data.code === '1') {
          this.list.push({ id: response.data, name: this.shop })
          this.shop = ''
        } else {
          alert(response.data.msg)
        }
      }).finally(() => { this.loading = false })
    }
  }
}
</script>

<style scoped>

</style>
