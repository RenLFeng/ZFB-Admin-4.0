<template>
  <div>
    <div class="base-tit">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>设备管理</el-breadcrumb-item>
        <el-breadcrumb-item>设备日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input clearable v-model="deviceNumber" placeholder="设备编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="startDate"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="创建时间"
            style="width:200px"
          ></el-date-picker>至
          <el-date-picker
            v-model="endDate"
            value-format="yyyy-MM-dd hh:mm:ss"
            type="datetime"
            placeholder="创建时间"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" @click="search">搜索</el-button>
        </el-form-item>
        <div style="float:right">
          <el-form-item>
            <el-input v-model="devNo" placeholder="输入设备号"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" @click="synchronize">同步设备日志</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-table :data="deviveLogData" border style="width: 100%">
      <el-table-column
        v-for="v in table"
        :prop="v.tableProp"
        :key="v.tableProp"
        :label="v.tableLabel"
      ></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <a style="color:#409EFF" :href="scope.row.logUrl">下载</a>
        </template>
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { deviceLogColumn, formatData } from './own/deviceLog.js'
import { mixins } from '@/core'
import { post } from '../../store/requestFacade.js'
export default {
  mixins: [mixins.pageMixin],
  data() {
    return {
      table: [],
      deviceNumber: '',
      startDate: '',
      endDate: '',
      deviveLogData: [],
      devNo: ''
    }
  },
  methods: {
    search() {
      this.loadData()
    },
    getUrl() {
      return 'log/query'
    },
    getPageParams() {
      return {
        devNo: this.deviceNumber,
        stateDate: this.startDate,
        endDate: this.endDate
      }
    },
    handleRows(rows) {
      this.deviveLogData = formatData([].concat(rows))
    },
    async synchronize() {
      if (this.devNo === '') {
        this.$message({
          type: 'warning',
          message: '请输入设备号'
        })
      } else {
        try {
          const res = await post({
            url: 'log/getNewestLog',
            data: {
              devNo: this.devNo
            }
          })
          this.$message({
            type: 'success',
            message: res.msg
          })
        } catch (error) {
          console.log(error)
        }
      }
    }
  },
  mounted() {
    this.table = deviceLogColumn
    this.loadData()
  }
}
</script>

<style scoped>
.base-tit {
  padding-top: 12px;
  padding-bottom: 12px;
}
</style>
