<template>
  <div>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input clearable v-model="phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settlementStatus">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-time-picker
            is-range
            v-model="settlementTimeRange"
            value-format="HH:mm:ss"
            start-placeholder="结算时间"
            end-placeholder="结算时间"
            :unlink-panels="true"
            range-separator="-"
            style="width:222px;margin-right:10px"
          ></el-time-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="VipRepayDayData" style="width: 100%" size="small">
      <el-table-column
        v-for=" v in particularsTitleList"
        :prop="v.prop"
        :label="v.title"
        :key="v.title"
      ></el-table-column>
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
import { filterUerLeveL } from '@/util'
import { mixins } from '@/core'
import { particularsTitle } from './table.js'
export default {
  name: 'quick-vip-repay-day',
  mixins: [mixins.pageMixin],
  data() {
    return {
      particularsTitleList: [],
      phone: '',
      settlementStatus: '',
      settlementTimeRange: '',
      VipRepayDayData: []
    }
  },
  methods: {
    search() {}
  },
  mounted() {
    this.particularsTitleList = filterUerLeveL(particularsTitle)
  }
}
</script>

<style lang="css" scoped>
</style>
