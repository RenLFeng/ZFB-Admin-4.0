<template>
  <div class="insuranceInfo">
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>保单信息</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="head-right">
        <el-button type="text" @click="download" v-if="canExportInsuranceInfo">
          <span class="el-icon-lx-batch-export"></span>批量导出
        </el-button>
        <el-button type="text" @click="showExport = true" v-if="canInsuranceExportHistory">
          <span class="el-icon-tickets"></span>导出记录
        </el-button>
      </div>
    </div>
    <div class="searchBox">
      <p>
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form size="small" :inline="true" class="demo-form-inline" v-show="activeNames">
        <el-form-item label="手机账号">
          <el-input clearable v-model="useraccount" placeholder="手机账号"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button size="small" type="primary" @click="search">搜索</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="insurantInfo" border style="width: 100%">
      <el-table-column
        v-for="v in table"
        :prop="v.tableProp"
        :label="v.tableLabel"
        :width="v.width"
        :key="v.tableProp"
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
          :page-sizes="[10, 30, 50, 100]"
          layout="total, prev, pager, next,sizes"
          :total="paging.total"
        ></el-pagination>
      </div>
    </div>
    <record-form v-if="showExport" :flag="showExport" @modalClose="modalClose" @update="update"></record-form>
  </div>
</template>
<script>
import { insuranceBaseColumn, parseInsurance } from './own/calc.js'
import { queryPermission } from '@/util'
import recordForm from './exportRecord'
import { mixins, excel } from '@/core'
export default {
  name: 'insurance-info',
  mixins: [mixins.pageMixin],
  components: {
    recordForm
  },
  data() {
    return {
      pageSize: 10,
      table: [],
      useraccount: '',
      updateInsurance: false,
      showExport: false,
      record: [],
      insurantInfo: []
    }
  },
  computed: {
    canExportInsuranceInfo() {
      return queryPermission('exportInsuranceInfo')
    },
    canInsuranceExportHistory() {
      return queryPermission('insuranceExportHistory')
    }
  },
  methods: {
    download: excel.writeFromUrl('user/insurance/exportinsurance'),
    reset() {
      this.useraccount = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    // 获取所有保单信息
    getUrl() {
      return 'user/insurance/getallinsurance'
    },
    getPageParams() {
      return {
        useraccount: this.useraccount,
        pageSize: this.pageSize
      }
    },
    handleRows(rows) {
      this.insurantInfo = parseInsurance([].concat(rows))
    },
    modalClose() {
      this.showExport = false
    },
    update() {
      this.loadData()
    }
  },
  mounted() {
    this.table = insuranceBaseColumn()
    this.loadData()
  }
}
</script>
<style scoped>
</style>
