<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>端口订单</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchBox">
      <p>
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form
        size="small"
        :inline="true"
        :model="searchData"
        class="demo-form-inline"
        v-show="activeNames"
      >
        <el-form-item label="手机号码">
          <el-input clearable placeholder="手机号码" v-model="searchData.phone"></el-input>
        </el-form-item>
        <el-form-item label="设备编号">
          <el-input clearable placeholder="设备编号" v-model="searchData.devNo"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select clearable v-model="searchData.status" placeholder="状态">
            <el-option label="支付成功" value="3"></el-option>
            <el-option label="支付失败" value="-1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table border :data="orderData" style="width: 100%" size="small">
      <el-table-column
        v-for="v in table.slice(0,9)"
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
        v-for="v in table.slice(9)"
        :prop="v.tableProp"
        :key="v.tableProp"
        :label="v.tableLabel"
      ></el-table-column>
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
import { slotOrderColumn, formatTableData } from './own/slotOrder.js'
import { mixins } from '@/core'
export default {
  name: 'slot-order',
  mixins: [mixins.pageMixin],
  data() {
    return {
      pageSize: 10,
      table: [],
      orderData: [],
      searchData: {
        phone: '',
        devNo: '',
        status: ''
      }
    }
  },
  methods: {
    reset() {
      this.searchData.phone = ''
      this.searchData.devNo = ''
      this.searchData.status = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      return 'port/getorder'
    },
    getPageParams() {
      return {
        userAccount: this.searchData.phone,
        orderStatus: this.searchData.status,
        devNo: this.searchData.devNo,
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
    this.table = slotOrderColumn()
    this.loadData()
  }
}
</script>

<style lang="css" scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
