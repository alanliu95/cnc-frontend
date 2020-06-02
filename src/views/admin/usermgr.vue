<template>
  <el-container v-loading="loading">
    <el-header>
      <div class="div-float-left">
        <el-input
          v-model="filters.name"
          class="deviceName"
          type="text"
          placeholder="用户名"
          auto-complete="on"
        />
      </div>
      <!--        <div class="div-float-left">-->
      <!--          <el-form-item class="deviceState">-->
      <!--            <el-select v-model="filters.state" placeholder="状态">-->
      <!--              <el-option label="正常" value="0" />-->
      <!--              <el-option label="停用" value="1" />-->
      <!--            </el-select>-->
      <!--          </el-form-item>-->
      <!--        </div>-->
      <div class="div-float-right">
        <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-plus" tabindex="3" @click.native.prevent="addUser">新建用户</el-button>
      </div>
      <div class="div-float-right">
        <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" @click.native.prevent="handleClear">重置</el-button>
      </div>
      <div class="div-float-right">
        <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" @click.native.prevent="handleFind">查询</el-button>
      </div>
    </el-header>
    <el-main>
      内部也该有用户管理吧？
      <el-table :data="list">
        <el-table-column label="序号" type="index" />
        <el-table-column label="名称" prop="name" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="delUser(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="删除提示" :visible.sync="visibleDel">
        <span>是否要删除该用户：{{ tmpData.name }}</span>
        <span slot="footer">
          <el-button @click="visibleDel = false">否</el-button>
          <el-button @click="onConfirmDel">是</el-button>
        </span>
      </el-dialog>
      <el-dialog title="添加车间" :visible.sync="visibleNew">
        <el-form ref="newForm" :model="tmpData" :rules="valueRules" label-position="right" label-width="100px">
          <el-form-item label="名称：" prop="name">
            <el-input v-model="tmpData.name" />
          </el-form-item>
          <el-form-item label="密码：" prop="pwd">
            <el-input v-model="tmpData.pwd" />
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="visibleNew = false">否</el-button>
          <el-button @click="onConfirmAdd">是</el-button>
        </span>
      </el-dialog>
    </el-main>
  </el-container>
</template>

<script>
import { getUsers, addUser, delUser } from '@/api/admin'

export default {
  name: 'Usermgmt',
  data() {
    const validateValue = (rule, value, callback) => {
      if (value.trim().length === 0) {
        callback(new Error('内容不能为空'))
      } else {
        callback()
      }
    }
    return {
      filters: {
        name: '',
        state: ''
      },
      data: {
        name: '',
        id: ''
      },
      list: [],
      loading: false,
      visibleNew: false,
      visibleDel: false,
      tmpData: {
        id: '',
        name: '',
        pwd: ''
      },
      valueRules: {
        name: [{ required: true, trigger: 'blur', validator: validateValue }],
        pwd: [{ required: true, trigger: 'blur', validator: validateValue }]
      },
      delIndex: 0
    }
  },
  mounted() {
    this.handleFind()
  },
  methods: {
    handleClear() {
      this.filters.name = ''
      this.filters.state = ''
    },
    handleFind() {
      this.loading = true
      getUsers(this.filters).then(response => {
        this.list = response.data
      }).finally(() => { this.loading = false })
    },
    delUser(idx, row) {
      // 删除用户
      this.delIndex = idx
      this.tmpData = row
      this.visibleDel = true
    },
    onConfirmDel() {
      // 删除用户
      this.loading = true
      delUser(this.tmpData.id).then(response => {
        if (response.data.code === '1') {
          this.list.splice(this.delIndex, 1)
        } else {
          alert(response.data.msg)
        }
      }).finally(() => {
        this.loading = false
        this.visibleDel = false
      })
    },
    addUser() {
      this.tmpData = { id: '', name: '', pwd: '' }
      this.visibleNew = true
    },
    onConfirmAdd() {
      // 添加用户
      this.loading = true
      addUser({ name: this.tmpData.name, pwd: this.tmpData.pwd }).then(response => {
        if (response.data.code === '1') {
          this.tmpData.id = response.data.id
          this.list.push(this.tmpData)
          this.tmpData = { id: '', name: '', pwd: '' }
        } else {
          alert(response.data.msg)
        }
      }).finally(() => { this.loading = false })
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
