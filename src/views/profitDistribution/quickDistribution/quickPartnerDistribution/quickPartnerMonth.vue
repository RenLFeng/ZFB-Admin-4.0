<template>
  <div>
    <div class="searchBox">
      <p class="total">
        <span>总交易金额：{{totalPerformance|normAmount}}元，</span>
        <span>月结总分润：{{totalProfit|normAmount}}元</span>
      </p>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input clearable v-model="partnerName" placeholder="合伙人姓名" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input clearable v-model="partnerPhone" placeholder="手机号码" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item v-if="level ===levelMap.PLATFORM">
          <el-input clearable v-model="province" placeholder="省级机构" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.PROVINCIAL">
          <el-input clearable v-model="oneOrgan" placeholder="一级机构" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item v-if="level <=levelMap.ORGAN">
          <el-input clearable v-model="countyOrgan" placeholder="二级机构" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-select clearable placeholder="结算状态" v-model="settleStatus" style="width:200px">
            <el-option label="未结算" value="0"></el-option>
            <el-option label="已结算" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="month"
            value-format="yyyy-MM"
            placeholder="结算月份"
            style="width:200px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border :data="VipRepayMonthData" style="width: 100%" size="small">
      <el-table-column v-for=" v in TableTitleList" :prop="v.prop" :label="v.title" :key="v.title"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="clickDistributionDetail(scope.row)">分润详情</el-button>
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
    <quick-partner-month-detail
      v-if="detailShow"
      @closeDetail="closeDetail"
      :details="details"
      :profitType="profitType"
    ></quick-partner-month-detail>
  </div>
</template>
<script>
import { levelMap } from '../../../../server/level.js'
import { queryPermission, filterUerLeveL } from '@/util'
import { mixins } from '@/core'
import { TableTitle, ParseRoleList } from './table.js'
import quickPartnerMonthDetail from './quickPartnerMonthDetail'
export default {
  name: 'quick-Partner-month',
  mixins: [mixins.pageMixin],
  components: {
    quickPartnerMonthDetail
  },
  props: {
    profitType: {
      type: Number,
      default: null
    }
  },
  computed: {
    canQuickVipRepayMonthDetail() {
      return queryPermission('quickVipRepayMonthDetail')
    },
    canQuickVipReceiptMonthDetail() {
      return queryPermission('quickVipReceiptMonthDetail')
    }
  },
  data() {
    return {
      levelMap,
      level: '',
      TableTitleList: [],
      VipRepayMonthData: [],
      detailShow: false,
      partnerName: '',
      partnerPhone: '',
      province: '',
      oneOrgan: '',
      countyOrgan: '',
      settleStatus: '',
      date: '',
      totalPerformance: '',
      totalProfit: '',
      details: ''
    }
  },
  methods: {
    search() {
      this.loadData(true)
    },
    clickDistributionDetail(row) {
      this.detailShow = true
      this.details = row
    },
    closeDetail() {
      this.detailShow = false
    },
    getUrl() {
      return 'partnerProfit/query'
    },
    getPageParams() {
      return {
        profitType: this.profitType,
        partnerName: this.partnerName,
        partnerPhone: this.partnerPhone,
        province: this.province,
        oneOrgan: this.oneOrgan,
        countyOrgan: this.countyOrgan,
        settleStatus: this.settleStatus,
        date: this.date
      }
    },
    handleRows(rows) {
      this.VipRepayMonthData = ParseRoleList([].concat(rows))
      this.totalPerformance = this.getExtra('totalPerformance')
      this.totalProfit = this.getExtra('totalProfit')
    }
  },
  mounted() {
    this.level = localStorage.getItem('level')
    this.TableTitleList = filterUerLeveL(TableTitle)
    this.loadData()
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
