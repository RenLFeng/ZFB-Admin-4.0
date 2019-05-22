<template>
  <div>
    <div class="searchBox">
      <p style="text-align:right">
        <el-button @click="toggle" type="text" :icon="icon">{{btnText}}</el-button>
      </p>
      <el-form :inline="true" label-width="100px" v-show="activeNames">
        <el-form-item label="下发时间">
          <el-date-picker v-model="beginTime" value-format="yyyy-MM-dd" placeholder="下发时间(开始)"></el-date-picker>&nbsp; 至 &nbsp;
          <el-date-picker v-model="endTime" value-format="yyyy-MM-dd" placeholder="下发时间(结束)"></el-date-picker>
        </el-form-item>
        <el-form-item label="申请机构">
          <el-input v-model="deliveryOragan" placeholder="请输入名称或编号"></el-input>
        </el-form-item>
      </el-form>
      <div style="margin-bottom: 10px">
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset">重置</el-button>
      </div>
    </div>
    <el-table :data="deliveryRecordData" border style="width: 100%">
      <el-table-column
        v-for="(v,i) in deliverTitleList"
        :key="i"
        :label="v.title"
        :prop="v.prop"
        :width="v.width"
      ></el-table-column>
    </el-table>
    <div style="padding: 16px; background: white; overflow: hidden;">
      <div style="float: right;">
        <el-pagination
          background
          :page-sizes="[10, 30, 50, 100]"
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
import { mixins } from '@/core'
import { deliverTitle, deliverParseRoleList } from './table.js'
import { filterUerLeveL } from '../../../util'
export default {
  name: 'active-code-deliver-record',
  mixins: [mixins.pageMixin],
  props: {
    reload: {
      type: Boolean
    }
  },
  data() {
    return {
      pageSize: 10,
      deliveryOragan: '',
      deliverTitleList: filterUerLeveL(deliverTitle),
      beginTime: '',
      endTime: '',
      deliveryRecordData: [],
      deviceNumber: 0
    }
  },
  methods: {
    reset() {
      this.deliveryOragan = ''
      this.beginTime = ''
      this.endTime = ''
      this.paging.currentPage = 1
      this.loadData(true)
    },
    getUrl() {
      return 'codeOut/queryRecord'
    },
    getPageParams() {
      return {
        pageSize: this.pageSize,
        applyOrganName: this.deliveryOragan,
        beginTime: this.beginTime,
        endTime: this.endTime
      }
    },
    handleRows(rows) {
      this.deviceNumber = this.getExtra('number')
      this.deliveryRecordData = deliverParseRoleList([].concat(rows))
    }
  },
  mounted() {
    this.loadData()
  }
}
</script>

<style lang="css" scoped>
.totalNumber {
  position: absolute;
  right: 15px;
  top: 15px;
  font-size: 14px;
}
</style>
