<template>
  <div>
    <p
      style="padding-bottom:15px;color:#666;font-size:15px;text-align:right"
    >个人总业绩:{{totalPersonalProfit|normAmount}} 元 &nbsp;&nbsp;团队总业绩:{{totalTeamProfit|normAmount}} 元 &nbsp;&nbsp;日结总分润:{{totalDailyAmount|normAmount}} 元, &nbsp;&nbsp;合伙人总收益:{{totalPartnerProfit|normAmount}} 元</p>
    <div class="searchBox">
      <el-form :inline="true" class="demo-form-inline" size="small">
        <el-form-item>
          <el-input clearable v-model="partnerName" placeholder="合伙人名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="phone" placeholder="手机号码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="upPartnerName" placeholder="上级合伙人"></el-input>
        </el-form-item>
        <el-form-item v-if="level !== levelMap.SECONDORGAN">
          <el-input clearable v-model="organName" placeholder="机构名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settlementStatus">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="settlementMonth"
            type="month"
            placeholder="结算月份"
            value-format="yyyy-MM"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="teamRepayMonthData" style="width: 100%" size="small">
      <el-table-column
        v-for="(v,i) in MonthTableList"
        :prop="v.prop"
        :label="v.title"
        :width="v.width"
        :key="i"
      ></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            v-if="type===2&&canTeamRepayDistributionMonthDetail || type===1&&canTeamReceiptDistributionMonthDetail"
            @click="clickDistributionDetail(scope.row)"
          >分润详情</el-button>
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
    <team-repay-distribution-month-detail
      v-if="detailShow"
      @closeDetail="closeDetail"
      :type="type"
      :teamMonthDetailData="teamMonthDetailData"
    />
  </div>
</template>

<script>
import { queryPermission } from '@/util'
import { mixins } from '@/core'
import teamRepayDistributionMonthDetail from './teamDistributionMonthDetail/repayIndex'
import { levelMap } from '../../../../server/level.js'
import { MonthTableTitle, MonthParseRoleList } from './table.js'
import { filterUerLeveL } from '../../../../util'

export default {
  name: 'team-repay-distribution-month',
  components: {
    teamRepayDistributionMonthDetail
  },
  mixins: [mixins.pageMixin],
  computed: {
    canTeamRepayDistributionMonthDetail() {
      return queryPermission('teamRepayDistributionMonthDetail')
    },
    canTeamReceiptDistributionMonthDetail() {
      return queryPermission('teamReceiptDistributionMonthDetail')
    }
  },
  props: {
    type: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      level: '',
      levelMap: levelMap,
      MonthTableList: filterUerLeveL(MonthTableTitle),
      partnerName: '',
      upPartnerName: '',
      organName: '',
      phone: '',
      settlementStatus: '',
      settlementMonth: '',
      teamRepayMonthData: [],
      detailShow: false,
      teamMonthDetailData: '',
      totalPersonalProfit: '',
      totalTeamProfit: '',
      totalDailyAmount: '',
      totalPartnerProfit: ''
    }
  },
  methods: {
    search() {
      this.loadData()
    },
    getUrl() {
      return 'partnerProfit/monthProfit'
    },
    getPageParams() {
      return {
        type: this.type,
        partnerName: this.partnerName,
        upPartnerName: this.upPartnerName,
        organName: this.organName,
        phone: this.phone,
        settleStatus: this.settlementStatus,
        date: this.settlementMonth
      }
    },
    handleRows(rows) {
      this.teamRepayMonthData = MonthParseRoleList(rows)
      this.totalPersonalProfit = this.getExtra('totalPersonalProfit')
      this.totalTeamProfit = this.getExtra('totalTeamProfit')
      this.totalDailyAmount = this.getExtra('totalDailyAmount')
      this.totalPartnerProfit = this.getExtra('totalPartnerProfit')
    },
    clickDistributionDetail(row) {
      this.detailShow = true
      this.teamMonthDetailData = row
    },
    closeDetail() {
      this.detailShow = false
    },
    SettlementTime(addDate) {
      if (!addDate) return ''
      const time = new Date(addDate)
      let y = time.getFullYear()
      let MM = time.getMonth() + 1
      if (MM < 10) {
        return y + '-0' + MM
      }
      return y + '-' + MM
    },
    settleStatus(row, column) {
      const status = {
        0: '未结算',
        1: '已结算'
      }
      return status[row.settleStatus]
    }
  },
  mounted() {
    this.loadData()
    this.level = localStorage.getItem('level')
  }
}
</script>

<style lang="css" scoped>
</style>
