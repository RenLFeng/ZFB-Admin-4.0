<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>测评订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="screenBatch">
      <p>
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form
        size="small"
        :inline="true"
        :model="searchData"
        class="demo-for m-inline"
        v-show="activeNames"
      >
        <el-form-item label="用户姓名">
          <el-input clearable v-model="searchData.username" placeholder="用户姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户手机号">
          <el-input clearable v-model="searchData.phone" placeholder="用户手机号"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable v-model="searchData.status" placeholder="状态">
            <el-option label="支付成功" value="3"></el-option>
            <el-option label="支付失败" value="-1"></el-option>
            <el-option label="支付中" value="1"></el-option>
            <el-option label="待支付" value="0"></el-option>
            <el-option label="下单失败" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="orderData" border size="small" style="width: 100%">
      <el-table-column
        v-for="v in table.slice(0,6)"
        :prop="v.tableProp"
        :key="v.tableProp"
        :label="v.tableLabel"
      ></el-table-column>
      <el-table-column prop="orderStatus" label="状态">
        <template slot-scope="scope">
          <span style="color:#F56C6C" v-if="scope.row.orderStatus === -1">支付失败</span>
          <span v-if="scope.row.orderStatus === 0">待支付</span>
          <span v-if="scope.row.orderStatus === 1">支付中</span>
          <span style="color:#F56C6C" v-if="scope.row.orderStatus === 2">下单失败</span>
          <span style="color:#67C23A" v-if="scope.row.orderStatus === 3">支付成功</span>
        </template>
      </el-table-column>
      <el-table-column
        v-for="v in table.slice(6)"
        :prop="v.tableProp"
        :key="v.tableProp"
        :label="v.tableLabel"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a :href="scope.row.ext" target="_blank" class="skip">查看</a>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="paging.currentPage"
          :page-size="paging.pageSize"
          layout="total, prev, pager, next, sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { evaluationOrderColumn, formatTableData } from './own/evaluationOrder.js'
import { queryPermission } from '@/util'
import { mixins } from '@/core'
export default {
  name: 'evaluation-order',
  mixins: [mixins.pageMixin],
  data() {
    return {
      pageSize: 10,
      table: [],
      searchData: {
        phone: '',
        status: ''
      },
      orderData: []
    }
  },
  methods: {
    reset() {
      this.searchData.username = ''
      this.searchData.phone = ''
      this.searchData.status = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      return 'orderpay/evaluation'
    },
    getPageParams() {
      return {
        username: this.searchData.username,
        userAccount: this.searchData.phone,
        orderStatus: this.searchData.status,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.orderData = formatTableData([].concat(rows))
    },
    orderStatus(row, column) {
      const statuMap = {
        '-1': '支付失败',
        0: '待支付',
        1: '支付中',
        2: '下单失败',
        3: '支付成功'
      }
      return statuMap[row.orderStatus]
    }
  },
  mounted() {
    this.table = evaluationOrderColumn()
    this.loadData()
  },
  computed: {
    canCheckDetail() {
      return queryPermission('checkDetail') // 查看
    }
  }
}
</script>
<style scoped>
.base-tit {
  margin: 15px 0;
}
.skip:visited,
.skip:link,
.skip:active {
  text-decoration: none;
  color: #409eff;
}
</style>
