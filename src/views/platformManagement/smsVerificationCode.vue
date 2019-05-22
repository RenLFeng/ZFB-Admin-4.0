<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>平台管理</el-breadcrumb-item>
        <el-breadcrumb-item>短信验证码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchBox">
      <el-form
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model='receivePhone'
            placeholder='手机号码'
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click='search'
          >搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data='smsCodeInfo'
      border
      style="width: 100%"
    >
      <!-- <el-table-column prop="smsId" label="ID">
        </el-table-column> -->
      <el-table-column
        v-for="v in table"
        :key="v.tableProp"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :width="v.width"
      >
      </el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, jumper"
          :total="paging.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { smsCodeBaseColumn, parseSmsCode } from './own/smsCode.js'
import { mixins } from '@/core'
export default {
  name: 'sms-verification-code',
  mixins: [mixins.pageMixin],
  data() {
    return {
      table: [],
      receivePhone: '',
      smsCodeInfo: []
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    // 所有短信
    getUrl() {
      return 'msg/msgsmsinfo'
    },
    getPageParams() {
      return {
        receivePhone: this.receivePhone
      }
    },
    handleRows(rows) {
      this.smsCodeInfo = parseSmsCode([].concat(rows))
    }
  },
  mounted() {
    this.loadData()
    this.table = smsCodeBaseColumn()
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
