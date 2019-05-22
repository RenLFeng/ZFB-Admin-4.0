<template>
  <div>
    <p
      style="padding-bottom:15px;color:#666;font-size:15px;text-align:right"
    >总交易金额: {{totalTradeAmt|normAmount}}元 &nbsp;合伙人日结总分润:{{totalProfitAmt|normAmount}} 元</p>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input clearable v-model="partnerName" placeholder="合伙人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="upPartnerName" placeholder="上级合伙人"></el-input>
        </el-form-item>
        <el-form-item v-if="level !== levelMap.SECONDORGAN">
          <el-input clearable v-model="organName" placeholder="机构名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="merchantName" placeholder="商户名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settlementStatus">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width:160px"
            v-model="startDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结算开始日期"
          ></el-date-picker>至
          <el-date-picker
            style="width:160px"
            v-model="endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="结算结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="teamDayData" style="width: 100%" size="small">
      <el-table-column
        v-for="(v,i) in DayTableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
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
import { mixins } from '@/core'
import { levelMap } from '../../../../server/level.js'
import { DayTableTitle, DayParseRoleList } from './table.js'
import { filterUerLeveL } from '../../../../util'
const dealTypeMap = {
  REPAY: 2,
  RECEIPT: 1
}
export default {
  name: 'team-receipt-distribution-day',
  mixins: [mixins.pageMixin],
  data() {
    return {
      level: '',
      levelMap: levelMap,
      DayTableList: [],
      partnerName: '',
      upPartnerName: '',
      organName: '',
      merchantName: '',
      settlementStatus: '',
      startDate: '',
      endDate: '',
      teamDayData: [],
      totalTradeAmt: '',
      totalProfitAmt: ''
    }
  },
  props: {
    type: {
      type: Number,
      default: null
    }
  },
  methods: {
    search() {
      this.loadData()
    },
    getUrl() {
      return 'dailySettlement/dailyInfo'
    },
    getPageParams() {
      return {
        type: this.type,
        partnerName: this.partnerName,
        upPartnerName: this.upPartnerName,
        organName: this.organName,
        merchantName: this.merchantName,
        status: this.settlementStatus,
        startDate: this.startDate,
        endDate: this.endDate
      }
    },
    handleRows(rows) {
      this.teamDayData = DayParseRoleList(rows)
      this.totalTradeAmt = this.getExtra('totalTradeAmt')
      this.totalProfitAmt = this.getExtra('totalProfitAmt')
    },
    settleStatus(row, column) {
      const status = {
        0: '未结算',
        1: '已结算'
      }
      return status[row.status]
    }
  },
  mounted() {
    this.loadData()
    this.level = localStorage.getItem('level')
    if (this.type === dealTypeMap.RECEIPT) {
      this.DayTableList = filterUerLeveL(DayTableTitle).filter(v => v.type !== 'REPAY')
    } else {
      this.DayTableList = filterUerLeveL(DayTableTitle)
    }
  }
}
</script>

<style lang="css" scoped>
</style>
