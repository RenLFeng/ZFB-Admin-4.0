<template>
  <div>
    <div class="searchBox">
      <p class="total">
        <span>机构总交易量：{{totalPerformance|normAmount}}元</span>&nbsp;
        <span>机构总分润：{{totalProfit|normAmount}}元</span>&nbsp;
        <span>机构月结分润：{{totalMonthProfit|normAmount}}元</span>&nbsp;
      </p>
      <p class="total">
        <span>下级机构总分润：{{totalOrganProfit|normAmount}}元</span>&nbsp;
        <span>合伙人总分润：{{totalPartnerProfit|normAmount}}元</span>&nbsp;
      </p>
      <p class="total">
        <span>VIP总分润：{{totalVipProfit|normAmount}}元</span>&nbsp;
        <span>推荐奖励：{{totalRecommendedReward|normAmount}}元</span>&nbsp;
      </p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input clearable v-model="organName" placeholder="机构"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.PROVINCIAL">
          <el-input clearable v-model="upOrganName" placeholder="上级机构"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settleStatus">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="date" type="month" value-format="yyyy-MM" placeholder="结算月份"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="orgReceipData" style="width: 100%" size="small">
      <el-table-column
        v-for="v in TableTitleList"
        :prop="v.prop"
        :label="v.title"
        :key="v.title"
        :width="v.width"
      ></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" type="text" @click="clickDistributionDetail(scope.row)">分润详情</el-button>
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
    <quick-org-distribution-detail
      v-if="detailShow"
      @closeDetail="closeDetail"
      :organDetailData="organDetailData"
      :profitType="profitType"
    ></quick-org-distribution-detail>
  </div>
</template>

<script>
import { levelMap } from '../../../../server/level.js'
import { queryPermission, filterUerLeveL } from '@/util'
import { mixins } from '@/core'
import quickOrgDistributionDetail from './quickOrgDistributionDetail'
import { TableTitle, ParseRoleList } from './table.js'
export default {
  name: 'quick-org-repay-distribution-month',
  mixins: [mixins.pageMixin],
  components: {
    quickOrgDistributionDetail
  },
  computed: {
    canQuickOrgRepayDistributionMonthDetail() {
      return queryPermission('quickOrgRepayDistributionMonthDetail')
    },
    canQuickOrgReceiptDistributionMonthDetail() {
      return queryPermission('quickOrgReceiptDistributionMonthDetail')
    }
  },
  props: {
    profitType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      levelMap,
      level: '',
      TableTitleList: [],
      orgReceipData: [],
      organDetailData: {},
      organName: '',
      upOrganName: '',
      settleStatus: '',
      date: '',
      detailShow: false,
      totalOrganProfit: '',
      totalVipProfit: '',
      totalMonthProfit: '',
      totalPartnerProfit: '',
      totalRecommendedReward: '',
      totalPerformance: '',
      totalProfit: ''
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    getUrl() {
      return 'onlineProfit/organProfit'
    },
    getPageParams() {
      return {
        profitType: this.profitType,
        organName: this.organName,
        settleStatus: this.settleStatus,
        upOrganName: this.upOrganName,
        date: this.date
      }
    },
    handleRows(rows) {
      this.orgReceipData = ParseRoleList([].concat(rows))
      this.totalOrganProfit = this.getExtra('totalOrganProfit')
      this.totalVipProfit = this.getExtra('totalVipProfit')
      this.totalMonthProfit = this.getExtra('totalMonthProfit')
      this.totalPartnerProfit = this.getExtra('totalPartnerProfit')
      this.totalRecommendedReward = this.getExtra('totalRecommendedReward')
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
    },
    clickDistributionDetail(row) {
      this.detailShow = true
      this.organDetailData = row
    },
    closeDetail() {
      this.detailShow = false
    }
  },
  mounted() {
    this.loadData()
    this.level = localStorage.getItem('level')
    this.TableTitleList = filterUerLeveL(TableTitle)
  }
}
</script>

<style lang="css" scoped>
.total {
  color: #606266;
  font-size: 14px;
  text-align: right;
}
</style>
