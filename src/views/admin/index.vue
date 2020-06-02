<template>
  <div>
    <el-container v-loading="loading">
      <el-header>
        <div style="float: left">
          <el-input
            v-model="filters.name"
            class="factoryName"
            type="text"
            placeholder="工厂名"
            auto-complete="on"
            tabindex="0"
            @keyup.enter.native="handleFind"
          />
        </div>
        <div class="div-float-right">
          <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-plus" tabindex="3" @click.native.prevent="newFactory">新建工厂</el-button>
        </div>
        <div class="div-float-right">
          <el-button style="width:100%;margin-bottom:30px;" icon="el-icon-refresh-right" tabindex="2" @click.native.prevent="handleClear">重置</el-button>
        </div>
        <div class="div-float-right">
          <el-button type="primary" style="width:100%;margin-bottom:30px;" icon="el-icon-search" tabindex="1" @click.native.prevent="handleFind">查询</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table :data="list">
          <el-table-column label="序号" type="index" />
          <el-table-column label="工厂名" prop="name" />
          <el-table-column label="工厂地址" prop="addr" />
          <el-table-column label="负责人" prop="admin" />
          <el-table-column label="电话" prop="tell" />
          <el-table-column label="账号" prop="account" />
          <el-table-column label="密码" prop="pwd" />
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="viewUsers(scope.$index, scope.row)">操作员列表</el-button>
              <el-button type="text" @click="viewWorkshops(scope.$index, scope.row)">车间列表</el-button>
              <el-button type="text" @click="delFactory(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog title="删除提示" :visible.sync="visibleDel">
          <span>是否要删除该工厂：{{ factory }}</span>
          <span slot="footer">
            <el-button @click="visibleDel = false">否</el-button>
            <el-button @click="onConfirmDel">是</el-button>
          </span>
        </el-dialog>
        <el-dialog class="dialog" title="新建工厂" :visible.sync="visibleNew" width="500px">
          <el-form ref="newForm" :model="tmpData" :rules="valueRules" label-position="right">
            <el-form-item prop="name">
              <el-input v-model.trim="tmpData.name" placeholder="请输入工厂名称" />
            </el-form-item>
            <el-form-item prop="addr">
              <el-input v-model.trim="tmpData.addr" placeholder="请输入工厂地址" />
            </el-form-item>
            <el-form-item prop="admin">
              <el-input v-model.trim="tmpData.admin" placeholder="请输入负责人姓名" />
            </el-form-item>
            <el-form-item prop="tell">
              <el-input v-model.trim="tmpData.tell" placeholder="请输入电话号码" />
            </el-form-item>
          </el-form>
          <span slot="footer">
            <el-button @click="visibleNew = false">取消</el-button>
            <el-button type="primary" @click="onConfirmNew">确定</el-button>
          </span>
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getFactories, delFactory, addFactory } from '@/api/admin'

export default {
  name: 'Admin',
  data() {
    // const validateValue = (rule, value, callback) => {
    //   if (value.trim().length === 0) {
    //     callback(new Error('内容不能为空'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      filters: {
        name: ''
      },
      valueRules: {
        name: [{ required: true, trigger: 'blur', message: '请输入工厂名称' }],
        addr: [{ required: true, trigger: 'blur', message: '请输入工厂地址' }],
        admin: [{ required: true, trigger: 'blur', message: '请输入负责人姓名' }],
        tell: [{ required: true, trigger: 'blur', message: '请输入电话号码' }]
      },
      list: [],
      loading: false,
      visibleDel: false,
      visibleNew: false,
      factory: '',
      tmpData: { name: '', addr: '', admin: '', tell: '' },
      delIndex: -1
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
      getFactories(this.filters).then(response => {
        this.list = response.data
      }).finally(() => { this.loading = false })
    },
    newFactory() {
      // 添加新的工厂
      this.visibleNew = true
      this.tmpData = { name: '', addr: '', admin: '', tell: '', account: '', pwd: '' }
    },
    viewUsers(idx, data) {
      // 查看工厂的用户，表格中的按钮
      this.$router.push({ name: 'usermgr', query: { name: data.name, id: data.id }})
    },
    viewWorkshops(idx, data) {
      // 查看工厂的车间列表，表格中的按钮
      this.$router.push({ name: 'workshop', query: { name: data.name, id: data.id }})
    },
    delFactory(idx, data) {
      // 表格中的 删除 按钮
      this.tmpData = data
      this.factory = data.name
      this.delIndex = idx
      this.visibleDel = true
    },
    onConfirmDel() {
      // 删除工厂
      this.loading = true
      // 1、执行删除操作
      delFactory({ id: this.tmpData.id }).then(response => {
        if (response.data.code === '1') {
          // 2、从列表中移除
          this.list.splice(this.delIndex, 1)
        } else {
          alert(response.data.msg)
        }
      }).finally(() => {
        this.visibleDel = false
        this.loading = false
      })
    },
    onConfirmNew() {
      // 新建工厂
      this.$refs.newForm.validate(valid => {
        if (valid) {
          this.loading = true
          addFactory({ name: this.tmpData.name, addr: this.tmpData.addr, admin: this.tmpData.admin, tell: this.tmpData.tell }).then(response => {
            const result = response.data
            if (result.code === '1') {
              // 添加成功
              this.tmpData.account = this.tmpData.tell
              this.tmpData.pwd = this.tmpData.tell
              this.tmpData.id = result.id
              this.list.push(this.tmpData)
              this.tmpData = { name: '', addr: '', admin: '', tell: '', account: '', pwd: '' }
            } else {
              alert(result.msg)
            }
          }).finally(() => {
            this.loading = false
          })
        }
      })
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
  }
  .factoryName{
    width: 200px;
    padding: 12px;
  }
  .div-float-right{
    float: right;
    margin: 12px;
  }
</style>
<style>
  .el-dialog{
    border-radius: 5px !important;
  }
  .dialog .el-dialog__header {
    font-weight: 600;
    letter-spacing: 2px;
  }
  .dialog .el-dialog__title{
    color: #409eff;
  }
  .dialog .el-form {
    margin-right: 30px;
  }
  .dialog .el-input__inner{
    height: 50px;
    line-height: 50px;
  }
</style>
